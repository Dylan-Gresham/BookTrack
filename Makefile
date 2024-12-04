all: clean build
clean:
	cd src-tauri; cargo clean
build:
	source .env/bin/activate; yarn tauri dev; deactivate
run:
	source .env/bin/activate; yarn tauri dev; deactivate

