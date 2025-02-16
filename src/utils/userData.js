import { writeTextFile, readTextFile, exists, BaseDirectory } from "@tauri-apps/api/fs";

const FILE_NAME = "user_data.json";

// Function to get user data
export const getUserData = async () => {
  try {
    const fileExists = await exists(FILE_NAME, { dir: BaseDirectory.AppData });
    if (!fileExists) return {}; // Return empty object if file doesn't exist

    const data = await readTextFile(FILE_NAME, { dir: BaseDirectory.AppData });
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading user data:", error);
    return {};
  }
};

// Function to save user data
export const saveUserData = async (data) => {
  try {
    await writeTextFile(FILE_NAME, JSON.stringify(data, null, 2), {
      dir: BaseDirectory.AppData,
    });
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};
