//! Imports passport_matrix.json (from scrape_passport.py) into states/*.toml files.
//!
//! Run: cargo run --bin import-visa-json --features tools
//!
//! Reads passport_matrix.json where keys are ISO-2 codes (lowercase)
//! and values are arrays of { dest_code, dest_name, category, detail, days }.
//!
//! Maps category: vf → visa-free, voa → visa-on-arrival, eta → eta/e-visa, vr → visa-required
//! Uses dest_name for the country field (with name normalization).

use serde::Deserialize;
use std::collections::HashMap;
use std::fs;
use std::path::Path;

#[derive(Deserialize, Debug)]
struct VisaEntry {
    dest_code: String,
    dest_name: String,
    category: String,
    detail: String,
    days: Option<u32>,
}

fn map_category(category: &str, detail: &str) -> String {
    let d = detail.to_lowercase();
    match category {
        "vf" => "visa-free".to_string(),
        "voa" => {
            if d.contains("evisa") || d.contains("e-visa") {
                "e-visa".to_string()
            } else {
                "visa-on-arrival".to_string()
            }
        }
        "eta" => {
            if d.contains("evisa") || d.contains("e-visa") {
                "e-visa".to_string()
            } else if d.contains("evisitor") {
                "eta".to_string()
            } else {
                "eta".to_string()
            }
        }
        "vr" => "visa-required".to_string(),
        _ => "unknown".to_string(),
    }
}

/// Normalize passportindex destination names to match our TOML names
fn normalize_dest_name(name: &str) -> String {
    match name {
        "Czech Republic" => "Czechia".to_string(),
        "Congo (Dem. Rep.)" => "Democratic Republic of the Congo".to_string(),
        "Cote d'Ivoire (Ivory Coast)" | "Ivory Coast" => "Cote d'Ivoire".to_string(),
        "Russian Federation" => "Russia".to_string(),
        "Türkiye" | "Turkiye" => "Turkey".to_string(),
        "Viet Nam" => "Vietnam".to_string(),
        "Palestinian Territories" => "Palestine".to_string(),
        "St. Vincent and the Grenadines" => "Saint Vincent and the Grenadines".to_string(),
        "Swaziland" => "Eswatini".to_string(),
        _ => name.to_string(),
    }
}

fn escape_toml(s: &str) -> String {
    s.replace('\\', "\\\\").replace('"', "\\\"")
}

fn main() {
    let json_path = Path::new("passport_matrix.json");
    if !json_path.exists() {
        eprintln!("ERROR: passport_matrix.json not found.");
        eprintln!("Run: python scrape_passport.py");
        std::process::exit(1);
    }

    eprintln!("Reading passport_matrix.json...");
    let raw = fs::read_to_string(json_path).expect("Cannot read JSON");
    let matrix: HashMap<String, Vec<VisaEntry>> =
        serde_json::from_str(&raw).expect("Cannot parse JSON");

    eprintln!("Loaded {} passports from JSON", matrix.len());

    let states_dir = Path::new("states");
    let mut entries: Vec<_> = fs::read_dir(states_dir)
        .expect("Cannot read states/")
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().map_or(false, |ext| ext == "toml"))
        .collect();
    entries.sort_by_key(|e| e.file_name());

    let mut updated = 0;
    let mut not_found = Vec::new();

    for entry in &entries {
        let path = entry.path();
        let content = fs::read_to_string(&path).unwrap();

        let code = content
            .lines()
            .find(|l| l.starts_with("code = "))
            .and_then(|l| l.strip_prefix("code = \""))
            .and_then(|l| l.strip_suffix('"'))
            .unwrap_or("")
            .to_lowercase();

        if code.is_empty() {
            continue;
        }

        let visa_entries = match matrix.get(&code) {
            Some(e) => e,
            None => {
                let name = content
                    .lines()
                    .find(|l| l.starts_with("name = "))
                    .and_then(|l| l.strip_prefix("name = \""))
                    .and_then(|l| l.strip_suffix('"'))
                    .unwrap_or(&code);
                not_found.push(format!("{} ({})", name, code));
                continue;
            }
        };

        // Strip existing visa_access
        let base: String = content
            .lines()
            .take_while(|l| !l.starts_with("[[visa_access]]"))
            .collect::<Vec<_>>()
            .join("\n");

        // Build new visa_access section
        let mut section = String::from("\n");
        for ve in visa_entries {
            let access_type = map_category(&ve.category, &ve.detail);
            let dest = normalize_dest_name(&ve.dest_name);

            section.push_str("[[visa_access]]\n");
            section.push_str(&format!("country = \"{}\"\n", escape_toml(&dest)));
            section.push_str(&format!("type = \"{}\"\n", access_type));
            if let Some(days) = ve.days {
                if days > 0 && days <= 360 {
                    section.push_str(&format!("days = {}\n", days));
                }
            }
            section.push('\n');
        }

        let new_content = format!("{}\n{}", base.trim_end(), section);
        fs::write(&path, new_content).unwrap();
        updated += 1;
    }

    eprintln!("\nDone!");
    eprintln!("Updated: {} countries", updated);
    if !not_found.is_empty() {
        eprintln!("Not in JSON ({}):", not_found.len());
        for n in &not_found {
            eprintln!("  - {}", n);
        }
    }
}
