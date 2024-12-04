from datetime import datetime

import joblib
import mlflow
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    mean_absolute_percentage_error,
)
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.naive_bayes import MultinomialNB


def prepare_dataset(X: pd.DataFrame) -> pd.DataFrame:
    """Prepares the input dataset for usage in a scikit-learn pipeline."""
    text_cols = ["title", "author", "synopsis"]
    vectorizers = {}

    tfidf_features = []
    for col in text_cols:
        vectorizer = TfidfVectorizer(
            max_features=1000,  # 1,000 most relevant terms
            min_df=3,  # Ignore terms that appear in fewer than 3 books
            max_df=0.8,  # Ignore terms that appear in more than 80% of books
            ngram_range=(1, 3),  # Capture unigrams, bigrams, and trigrams
            sublinear_tf=True,  # Apply sublinear term frequency scaling
        )
        matrix = vectorizer.fit_transform(X[col].fillna(""))
        feature_names = [f"{col}_{feat}" for feat in vectorizer.get_feature_names_out()]
        vectorizers[col] = vectorizer
        df = pd.DataFrame(matrix.toarray(), columns=feature_names)
        tfidf_features.append(df)

    combined = pd.concat(tfidf_features, axis=1)
    total_pages = X[["totalPages"]]

    for col, vectorizer in vectorizers.items():
        joblib.dump(vectorizer, f"{col}_vectorizer.joblib", compress=3)

    return pd.concat([combined, total_pages.reset_index(drop=True)], axis=1)


def prepare_sample(sample: pd.DataFrame) -> pd.DataFrame:
    text_cols = ["title", "author", "synopsis"]
    vectorizers = {
        "title": joblib.load("title_vectorizer.joblib"),
        "author": joblib.load("author_vectorizer.joblib"),
        "synopsis": joblib.load("synopsis_vectorizer.joblib"),
    }

    tfidf_features = []
    for col in text_cols:
        matrix = vectorizers[col].transform(sample[col].fillna(""))
        feature_names = [
            f"{col}_{feat}" for feat in vectorizers[col].get_feature_names_out()
        ]
        df = pd.DataFrame(matrix.toarray(), columns=feature_names)
        tfidf_features.append(df)

    combined = pd.concat(tfidf_features, axis=1)
    total_pages = sample[["totalPages"]]

    return pd.concat([combined, total_pages.reset_index(drop=True)], axis=1)


def evaluate_model(model, X_test, y_test):
    y_pred = model.predict(X_test)
    mape = mean_absolute_percentage_error(y_test, y_pred)
    accuracy = accuracy_score(y_test, y_pred)
    print("Model Performance")
    print(f"Average Error: {mape:0.4f}%")
    print(f"Accuracy: {accuracy:0.2f}%")

    return accuracy


def find_params(dataset: pd.DataFrame):
    # Turn on mlflow and auto-logging
    mlflow.set_experiment(f'generate_new_model_{datetime.now().strftime("%B-%d_%Y")}')
    mlflow.autolog()

    # Prepare the dataset
    X: pd.DataFrame = prepare_dataset(dataset.drop("label", axis=1))
    y: pd.DataFrame = dataset.label

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Train
    forest = RandomForestClassifier(random_state=42)
    param_grid = {
        "n_estimators": [100, 200, 300, 400, 500],
        "max_features": ["sqrt", "log2"],
        "max_depth": [
            5,
            10,
            15,
            20,
            25,
            30,
            35,
            40,
            45,
            50,
            55,
            60,
            65,
            70,
            75,
            80,
            85,
            90,
            95,
            100,
        ],
        "min_samples_split": [2, 3, 4, 5, 6, 7, 8, 9, 10],
        "min_samples_leaf": [2, 3, 4, 5, 10],
        "bootstrap": [True, False],
    }
    clf = GridSearchCV(estimator=forest, param_grid=param_grid)
    clf.fit(X_train, y_train)

    baseline_model = RandomForestClassifier(random_state=42)
    baseline_model.fit(X_train, y_train)
    base_accuracy = evaluate_model(baseline_model, X_test, y_test)

    best_grid = clf.best_estimator_
    best_accuracy = evaluate_model(best_grid, X_test, y_test)

    improvement = 100 * ((best_accuracy - base_accuracy) / best_accuracy)
    print(f"Improvement of {improvement:.2f}%")

    print("Reports:")
    print("Baseline:")
    print(classification_report(y_test, baseline_model.predict(X_test)))
    print("\nBest GridSearch:")
    print(classification_report(y_test, best_grid.predict(X_test)))

    print("Best Estimator Parameters:")
    print(clf.best_params_)

    # Dump
    joblib.dump(best_grid, "model.joblib", compress=3)

    return best_grid


def generate_new_model(dataset: pd.DataFrame) -> RandomForestClassifier:
    # Turn on mlflow and auto-logging
    mlflow.set_experiment(f'generate_new_model_{datetime.now().strftime("%B-%d_%Y")}')
    mlflow.autolog()

    # Prepare the dataset
    X: pd.DataFrame = prepare_dataset(dataset.drop("label", axis=1))
    y: pd.DataFrame = dataset.label

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Train
    forest = RandomForestClassifier(
        n_estimators=100,
        max_features="sqrt",
        max_depth=15,
        min_samples_split=2,
        min_samples_leaf=2,
        bootstrap=True,
        random_state=42,
    )
    forest.fit(X_train, y_train)

    # Evalute
    _ = evaluate_model(forest, X_test, y_test)

    print("Classification Report:")
    print(classification_report(y_test, forest.predict(X_test)))

    # Dump
    joblib.dump(forest, f"model.joblib", compress=3)

    return forest


def gridsearch_nb_model(dataset: pd.DataFrame) -> MultinomialNB:
    # Turn on mlflow and auto-logging
    mlflow.set_experiment("GridSearchNB")
    mlflow.autolog()

    # Prep the dataset
    X: pd.DataFrame = prepare_dataset(dataset.drop("label", axis=1))
    y: pd.DataFrame = dataset.label

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Define parameter grid
    nb_grid = {
        "alpha": np.arange(0, 1.5, 0.05),
        "force_alpha": [False, True],
        "fit_prior": [False, True],
    }

    clf = GridSearchCV(MultinomialNB(), param_grid=nb_grid, n_jobs=-1, refit=True)
    clf.fit(X_train, y_train)

    best_model = clf.best_estimator_
    best_params = clf.best_params_

    print(f"Best NB Params:\n{best_params}")

    # Evaluate
    _ = evaluate_model(best_model, X_test, y_test)

    print("Classification Report:")
    print(classification_report(y_test, best_model.predict(X_test)))

    # Dump
    joblib.dump(best_model, f"nb_model.joblib", compress=3)

    return best_model


def generate_nb_model(dataset: pd.DataFrame) -> MultinomialNB:
    # Turn on mlflow and auto-logging
    mlflow.set_experiment(f'generate_new_model_{datetime.now().strftime("%B-%d_%Y")}')
    mlflow.autolog()

    # Prepare the dataset
    X: pd.DataFrame = prepare_dataset(dataset.drop("label", axis=1))
    y: pd.DataFrame = dataset.label

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Train
    nb = MultinomialNB(
        alpha=0.05,
        fit_prior=False,
        force_alpha=False,
    )
    nb.fit(X_train, y_train)

    # Evaluate
    _ = evaluate_model(nb, X_test, y_test)

    print("Classification Report:")
    print(classification_report(y_test, nb.predict(X_test)))

    # Dump
    joblib.dump(nb, f"nb_model.joblib", compress=3)

    return nb


def predict(sample: pd.DataFrame, model="nb"):
    """Makes a prediction using the saved model."""
    if model == "nb":
        nb: MultinomialNB = joblib.load("nb_model.joblib")

        prepared = prepare_sample(sample)

        return 1.0 - nb.predict_proba(prepared)
    elif model == "forest":
        forest: RandomForestClassifier = joblib.load("model.joblib")

        prepared = prepare_sample(sample)

        return forest.predict_proba(prepared)
    else:
        return NotImplementedError


def predict_rs(title, author, pages, synopsis, list, model="nb"):
    """Makes a prediction using the saved model.

    Returns the chance of the sample being the positive class.
    """
    sample = pd.DataFrame(
        {
            "title": title,
            "author": author,
            "totalPages": pages,
            "synopsis": synopsis,
            "list": list,
        },
        index=[1],
    )
    if model == "nb":
        nb: MultinomialNB = joblib.load("nb_model.joblib")

        prepared = prepare_sample(sample)

        return nb.predict_proba(prepared)[0][1]
    elif model == "forest":
        forest: RandomForestClassifier = joblib.load("model.joblib")

        prepared = prepare_sample(sample)

        return forest.predict_proba(prepared)[0][1]
    else:
        return NotImplementedError


if __name__ == "__main__":
    print("This file isn't meant to be executed.")
    print(
        "Please create your own script and import this library's methods to use them."
    )
    exit(1)
