#!/usr/bin/env python3
"""Generate TOML files for 27 territories with separate visa regimes."""
import os

TERRITORIES = [
    # (code, name, flag, region, pop, area_km2, currency, currency_name, supply_b, price_usd)
    ("HK", "Hong Kong", "🇭🇰", "Asia", 7500000, 1114, "HKD", "Hong Kong Dollar", 2100.0, 0.1282),
    ("MO", "Macau", "🇲🇴", "Asia", 695000, 33, "MOP", "Macanese Pataca", 30.0, 0.1240),
    ("BM", "Bermuda", "🇧🇲", "North America", 64000, 54, "BMD", "Bermudian Dollar", 3.5, 1.0000),
    ("KY", "Caymans", "🇰🇾", "Latin America", 69000, 264, "KYD", "Cayman Dollar", 5.0, 1.2195),
    ("GI", "Gibraltar", "🇬🇮", "Europe", 34000, 7, "GIP", "Gibraltar Pound", 1.5, 1.2700),
    ("VG", "Virgin", "🇻🇬", "Latin America", 31000, 151, "USD", "US Dollar", 0.5, 1.0000),
    ("TC", "Turks", "🇹🇨", "Latin America", 46000, 948, "USD", "US Dollar", 0.8, 1.0000),
    ("MS", "Montserrat", "🇲🇸", "Latin America", 5000, 102, "XCD", "East Caribbean Dollar", 0.1, 0.3700),
    ("AI", "Anguilla", "🇦🇮", "Latin America", 16000, 91, "XCD", "East Caribbean Dollar", 0.3, 0.3700),
    ("FK", "Falklands", "🇫🇰", "Latin America", 3800, 12173, "FKP", "Falkland Pound", 0.1, 1.2700),
    ("SH", "Helena", "🇸🇭", "Africa", 6100, 394, "SHP", "Saint Helena Pound", 0.05, 1.2700),
    ("GF", "Guyane", "🇬🇫", "Latin America", 310000, 83534, "EUR", "Euro", 3.0, 1.0800),
    ("GP", "Guadeloupe", "🇬🇵", "Latin America", 400000, 1628, "EUR", "Euro", 5.0, 1.0800),
    ("MQ", "Martinique", "🇲🇶", "Latin America", 375000, 1128, "EUR", "Euro", 5.0, 1.0800),
    ("RE", "Reunion", "🇷🇪", "Africa", 900000, 2511, "EUR", "Euro", 8.0, 1.0800),
    ("NC", "Caledonia", "🇳🇨", "Oceania", 290000, 18575, "XPF", "CFP Franc", 4.0, 0.0091),
    ("PF", "Tahiti", "🇵🇫", "Oceania", 280000, 4167, "XPF", "CFP Franc", 5.0, 0.0091),
    ("AW", "Aruba", "🇦🇼", "Latin America", 108000, 180, "AWG", "Aruban Florin", 3.0, 0.5587),
    ("CW", "Curacao", "🇨🇼", "Latin America", 155000, 444, "ANG", "Netherlands Antillean Guilder", 4.0, 0.5587),
    ("SX", "St. Martin", "🇸🇽", "Latin America", 44000, 34, "ANG", "Netherlands Antillean Guilder", 0.8, 0.5587),
    ("GL", "Greenland", "🇬🇱", "Europe", 57000, 2166086, "DKK", "Danish Krone", 2.0, 0.1460),
    ("FO", "Faroes", "🇫🇴", "Europe", 54000, 1393, "DKK", "Danish Krone", 2.5, 0.1460),
    ("PR", "Puerto Rico", "🇵🇷", "Latin America", 3200000, 9104, "USD", "US Dollar", 70.0, 1.0000),
    ("GU", "Guam", "🇬🇺", "Oceania", 172000, 549, "USD", "US Dollar", 3.0, 1.0000),
    ("VI", "US Virgin", "🇻🇮", "Latin America", 87000, 347, "USD", "US Dollar", 2.0, 1.0000),
    ("CK", "Cooks", "🇨🇰", "Oceania", 17000, 236, "NZD", "New Zealand Dollar", 0.2, 0.6100),
]

states_dir = "states"
created = 0
for code, name, flag, region, pop, area, curr, curr_name, supply, price in TERRITORIES:
    fname = f"{code.lower()}.toml"
    path = os.path.join(states_dir, fname)
    if os.path.exists(path):
        print(f"  SKIP {code} {name}: already exists")
        continue

    content = f'''name = "{name}"
code = "{code}"
flag = "{flag}"
region = "{region}"
population = {pop}
land_area_km2 = {area}
currency_code = "{curr}"
currency_name = "{curr_name}"
money_supply_b_usd = {supply}
token_price_usd = {price:.4f}
visa_free_destinations = 0
visa_free_inbound = 0
'''
    with open(path, 'w') as f:
        f.write(content)
    created += 1
    print(f"  {code} {name}")

print(f"\nCreated {created} territory files")
print(f"Total states: {len(os.listdir(states_dir))}")

if __name__ == "__main__":
    pass
