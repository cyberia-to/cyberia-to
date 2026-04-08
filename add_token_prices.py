#!/usr/bin/env python3
"""
Add token_price_usd field to each country's TOML file.

For each .toml file in states/:
1. Reads the file
2. Extracts the currency_code
3. Looks up the approximate USD price from a hardcoded dictionary
4. Inserts token_price_usd = X.XXXXX right after the money_supply_b_usd line
5. Skips files that already have token_price_usd
"""

import os
import re
import glob

# Approximate 2024 exchange rates: how many USD does 1 unit of this currency cost
# i.e. token_price_usd for currency X = 1 X in USD
CURRENCY_TO_USD = {
    # Major currencies
    "USD": 1.0,
    "EUR": 1.08,
    "GBP": 1.27,
    "JPY": 0.0067,
    "CNY": 0.14,
    "CHF": 1.13,
    "AUD": 0.66,
    "CAD": 0.74,
    "NZD": 0.61,
    "SEK": 0.096,
    "NOK": 0.094,
    "DKK": 0.145,
    "SGD": 0.75,
    "HKD": 0.128,
    "KRW": 0.00075,
    "INR": 0.012,
    "BRL": 0.20,
    "MXN": 0.058,
    "ZAR": 0.055,
    "RUB": 0.011,
    "TRY": 0.033,
    "PLN": 0.25,
    "CZK": 0.044,
    "HUF": 0.0028,
    "ILS": 0.27,
    "SAR": 0.2667,
    "AED": 0.2723,
    "QAR": 0.2747,
    "KWD": 3.26,
    "BHD": 2.6526,
    "OMR": 2.5974,
    "THB": 0.028,
    "MYR": 0.213,
    "IDR": 0.000063,
    "PHP": 0.018,
    "VND": 0.000041,
    "TWD": 0.032,
    "PKR": 0.0036,
    "BDT": 0.0091,
    "NGN": 0.00065,
    "EGP": 0.021,
    "KES": 0.0065,
    "GHS": 0.064,
    "XOF": 0.00165,
    "XAF": 0.00165,
    "MAD": 0.10,
    "TND": 0.32,
    "ARS": 0.0012,
    "CLP": 0.00106,
    "COP": 0.00025,
    "PEN": 0.27,
    "UAH": 0.026,
    "KZT": 0.0022,
    "GEL": 0.38,
    "AMD": 0.0026,
    # Additional currencies found in the dataset
    "AFN": 0.014,
    "ALL": 0.0105,
    "AOA": 0.0012,
    "AZN": 0.588,
    "BAM": 0.553,
    "BBD": 0.50,
    "BGN": 0.553,
    "BIF": 0.00035,
    "BND": 0.75,
    "BOB": 0.145,
    "BSD": 1.0,
    "BTN": 0.012,
    "BWP": 0.074,
    "BYN": 0.306,
    "BZD": 0.50,
    "CDF": 0.00036,
    "CRC": 0.0019,
    "CUP": 0.042,
    "CVE": 0.0098,
    "DJF": 0.0056,
    "DOP": 0.017,
    "DZD": 0.0074,
    "ERN": 0.0667,
    "ETB": 0.018,
    "FJD": 0.445,
    "GMD": 0.015,
    "GNF": 0.000116,
    "GTQ": 0.128,
    "GYD": 0.0048,
    "HNL": 0.041,
    "HTG": 0.0076,
    "IQD": 0.00076,
    "IRR": 0.0000238,
    "ISK": 0.0073,
    "JMD": 0.0065,
    "JOD": 1.41,
    "KGS": 0.0112,
    "KHR": 0.000245,
    "KMF": 0.0022,
    "KPW": 0.0011,
    "LAK": 0.000048,
    "LBP": 0.0000667,
    "LKR": 0.0033,
    "LRD": 0.0053,
    "LSL": 0.055,
    "LYD": 0.207,
    "MDL": 0.056,
    "MGA": 0.00022,
    "MKD": 0.0176,
    "MMK": 0.000476,
    "MNT": 0.00029,
    "MRU": 0.025,
    "MUR": 0.022,
    "MVR": 0.065,
    "MWK": 0.00058,
    "MZN": 0.016,
    "NAD": 0.055,
    "NIO": 0.027,
    "NPR": 0.0075,
    "PAB": 1.0,
    "PGK": 0.265,
    "PYG": 0.000134,
    "RON": 0.217,
    "RSD": 0.0092,
    "RWF": 0.00077,
    "SBD": 0.118,
    "SCR": 0.073,
    "SDG": 0.00167,
    "SLE": 0.045,
    "SOS": 0.00175,
    "SRD": 0.028,
    "SSP": 0.00077,
    "STN": 0.044,
    "SYP": 0.000077,
    "SZL": 0.055,
    "TJS": 0.091,
    "TMT": 0.286,
    "TOP": 0.425,
    "TTD": 0.148,
    "TZS": 0.00039,
    "UGX": 0.000264,
    "UYU": 0.026,
    "UZS": 0.000079,
    "VES": 0.028,
    "VUV": 0.0084,
    "WST": 0.367,
    "XCD": 0.37,
    "YER": 0.004,
    "ZMW": 0.038,
    "ZWL": 0.0031,
}


def process_file(filepath):
    """Process a single TOML file to add token_price_usd."""
    with open(filepath, "r") as f:
        content = f.read()

    # Skip if token_price_usd already present
    if "token_price_usd" in content:
        print(f"  SKIP {os.path.basename(filepath)}: token_price_usd already present")
        return False

    # Extract currency_code
    match = re.search(r'currency_code\s*=\s*"([^"]+)"', content)
    if not match:
        print(f"  SKIP {os.path.basename(filepath)}: no currency_code found")
        return False

    currency_code = match.group(1)
    price = CURRENCY_TO_USD.get(currency_code, 0.0)

    # Format the price value
    # Use enough decimal places to be meaningful
    if price >= 1.0:
        price_str = f"{price:.4f}"
    elif price >= 0.01:
        price_str = f"{price:.5f}"
    elif price >= 0.001:
        price_str = f"{price:.6f}"
    elif price >= 0.0001:
        price_str = f"{price:.7f}"
    else:
        price_str = f"{price}"

    # Insert token_price_usd right after the money_supply_b_usd line
    lines = content.split("\n")
    new_lines = []
    inserted = False

    for line in lines:
        new_lines.append(line)
        if not inserted and line.startswith("money_supply_b_usd"):
            new_lines.append(f"token_price_usd = {price_str}")
            inserted = True

    if not inserted:
        print(f"  WARN {os.path.basename(filepath)}: no money_supply_b_usd line found")
        return False

    with open(filepath, "w") as f:
        f.write("\n".join(new_lines))

    print(f"  OK   {os.path.basename(filepath)}: {currency_code} -> {price_str}")
    return True


def main():
    states_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "states")
    toml_files = sorted(glob.glob(os.path.join(states_dir, "*.toml")))

    print(f"Found {len(toml_files)} TOML files in {states_dir}")
    print()

    updated = 0
    skipped = 0
    for filepath in toml_files:
        if process_file(filepath):
            updated += 1
        else:
            skipped += 1

    print()
    print(f"Done: {updated} files updated, {skipped} files skipped")


if __name__ == "__main__":
    main()
