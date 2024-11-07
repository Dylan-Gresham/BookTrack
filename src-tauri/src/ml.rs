use std::str::FromStr;

use pyo3::{prelude::*, prepare_freethreaded_python};

pub fn predict(
    py_lib: &str,
    title: String,
    author: String,
    num_pages: usize,
    synopsis: String,
    list: String,
) -> Result<f64, String> {
    let result = Python::with_gil(|py| -> Result<f64, String> {
        let module = PyModule::from_code_bound(py, py_lib, "lib.py", "lib.py").unwrap();
        let predict_func = module.getattr("predict_rs").unwrap();

        match predict_func.call1((title, author, num_pages, synopsis, list)) {
            Ok(result) => Ok(result
                .extract::<f64>()
                .expect("Unable to convert Python response to a 64-bit float.")),
            Err(e) => Err(e.to_string()),
        }
    });

    match result {
        Ok(num) => {
            let pos_prob = num * 100.0;
            println!(
                "There is a {:.2}% chance of the sample being the positive class.",
                num * 100.0
            );
            println!(
                "There is a {:.2}% chance of the sample being the negative class.",
                (1.0 - num) * 100.0
            );
            Ok(pos_prob)
        }
        Err(err) => {
            eprintln!("{err}");
            Err(err.to_string())
        }
    }
}

pub fn prep_environment() -> String {
    let py_lib = include_str!(concat!(env!("CARGO_MANIFEST_DIR"), "/lib.py"));
    prepare_freethreaded_python();

    match String::from_str(py_lib) {
        Ok(code) => code,
        Err(_) => String::from("Error"),
    }
}
