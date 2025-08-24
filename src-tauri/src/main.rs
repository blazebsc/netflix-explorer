// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use std::fs;
use std::path::PathBuf;

#[derive(Serialize)]
struct MediaFile {
    name: String,
    path: String,
}

#[tauri::command]
fn scan_directory(dir: String) -> Vec<MediaFile> {
    let mut files = Vec::new();
    if let Ok(paths) = fs::read_dir(PathBuf::from(dir)) {
        for entry in paths.flatten() {
            let path = entry.path();
            if let Some(ext) = path.extension() {
                if ext == "mp4" || ext == "mkv" || ext == "avi" {
                    files.push(MediaFile {
                        name: path.file_stem().unwrap().to_string_lossy().to_string(),
                        path: path.to_string_lossy().to_string(),
                    });
                }
            }
        }
    }
    files
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![scan_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
