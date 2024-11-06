BOOKTRACK_DIR := /home/midge/repos/pp/BookTrack

all: clean build
clean:
	cd src-tauri; cargo clean
build:
	cd ${BOOKTRACK_DIR}; source .env/bin/activate; yarn tauri dev; deactivate
