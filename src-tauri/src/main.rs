// src-tauri/src/main.rs

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]




use tauri::{Manager, RunEvent};
use std::process::Command;
use reqwest::Client;

#[tauri::command]
async fn launch_python(app_handle: tauri::AppHandle) -> Result<String, String> {
    let resource_path = match app_handle
        .path_resolver()
        .resolve_resource("bin/main.exe")
    {
        Some(path) => path,
        None => return Err("Failed to resolve Python executable path".into()),
    };

    match Command::new(resource_path).spawn() {
        Ok(_) => Ok("Python process started successfully".into()),
        Err(e) => Err(format!("Failed to start Python process: {}", e)),
    }
}

#[tauri::command]
async fn shutdown_server() -> Result<String, String> {
    let client = Client::new();
    match client.get("http://127.0.0.1:8000/shutdown").send().await {
        Ok(_) => Ok("Shutdown request sent".into()),
        Err(e) => Err(format!("Failed to send shutdown request: {}", e)),
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle().clone();
            
            // Listen for app close event
            app.listen_global("tauri://close-requested", move |_| {
                tauri::async_runtime::block_on(async {
                    if let Err(e) = shutdown_server().await {
                        eprintln!("Failed to shutdown server: {}", e);
                    }
                });
            });

            // Start Python server on app launch
            if let Some(resource_path) = app.path_resolver().resolve_resource("bin/main.exe") {
                if let Err(e) = Command::new(resource_path).spawn() {
                    eprintln!("Failed to start Python process: {}", e);
                } else {
                    println!("Python process started successfully");
                }
            } else {
                eprintln!("Failed to resolve Python executable path");
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![launch_python, shutdown_server])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}


// use std::process::Command;
// use reqwest::Client;

// #[tauri::command]
// async fn launch_python(app_handle: tauri::AppHandle) -> Result<String, String> {
//     let resource_path = app_handle
//         .path_resolver()
//         .resolve_resource("bin/main.exe")
//         .expect("failed to resolve resource");

//     match Command::new(resource_path)
//         .spawn()
//     {
//         Ok(_) => Ok("Python process started successfully".into()),
//         Err(e) => Err(format!("Failed to start Python process: {}", e))
//     }
// }

// async fn shutdown_server() -> Result<(), Box<dyn std::error::Error>> {
//     let client = Client::new();
//     let _ = client.get("http://localhost:8000/shutdown").send().await?;
//     Ok(())
// }

// fn main() {
//     tauri::Builder::default()
//         .setup(|app| {
//             let resource_path = app
//                 .path_resolver()
//                 .resolve_resource("bin/main.exe")
//                 .expect("failed to resolve resource");

//             match Command::new(resource_path).spawn() {
//                 Ok(_) => println!("Python process started successfully"),
//                 Err(e) => eprintln!("Failed to start Python process: {}", e)
//             }
            
//             Ok(())
//         })
//         .invoke_handler(tauri::generate_handler![launch_python])
//         .run(tauri::generate_context!())
//         .expect("error while running tauri application");
// }