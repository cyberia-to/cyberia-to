use leptos::prelude::*;
use crate::data::{Country, SortField};

fn score_color(v: f64) -> &'static str {
    if v > 60.0 { "var(--cyber-green)" }
    else if v > 40.0 { "var(--cyber-cyan)" }
    else if v > 25.0 { "var(--cyber-yellow)" }
    else if v > 10.0 { "var(--cyber-orange)" }
    else { "var(--cyber-red)" }
}

#[component]
pub fn SortableHeader(
    field: SortField,
    current: ReadSignal<SortField>,
    ascending: ReadSignal<bool>,
    on_click: SignalSetter<SortField>,
) -> impl IntoView {
    let is_sorted = move || current.get() == field;
    let class = move || {
        let mut c = String::from("cyber-table-th");
        if is_sorted() {
            c.push_str(" sorted");
            if ascending.get() {
                c.push_str(" sort-asc");
            } else {
                c.push_str(" sort-desc");
            }
        }
        c
    };

    view! {
        <th class=class on:click=move |_| on_click.set(field)>
            {field.label()}
        </th>
    }
}

#[component]
pub fn CountryRow(country: Country, rank: usize) -> impl IntoView {
    let code = country.code.to_lowercase();
    let href = format!("/country/{}", code);
    let idx = country.index();

    let flag = country.flag.clone();
    let name = country.name.clone();
    let token_code = country.currency_code.clone();
    let token_slug = token_code.to_lowercase();
    let pop_fmt = country.population_fmt();
    let area_fmt = country.land_area_fmt();
    let price_fmt = country.price_fmt();
    let supply_fmt = country.supply_fmt();
    let cap_fmt = country.cap_fmt();
    let eco_out = format!("{:.1}", idx.eco_out_pct);
    let eco_in = format!("{:.1}", idx.eco_in_pct);
    let pop_out = format!("{:.1}", idx.pop_out_pct);
    let pop_in = format!("{:.1}", idx.pop_in_pct);
    let freedom_str = format!("{:.1}", idx.freedom);
    let openness_str = format!("{:.1}", idx.openness);

    let freedom_color = score_color(idx.freedom);
    let openness_color = score_color(idx.openness);

    view! {
        <tr on:click=move |_| {
            if let Some(window) = web_sys::window() {
                let _ = window.location().set_href(&href);
            }
        }>
            <td style="color: #333; width: 40px; text-align: right;">{rank}</td>
            <td>
                <span style="margin-right: 8px; font-size: 16px;">{flag.clone()}</span>
                <span style="color: #ccc;">{name.clone()}</span>
            </td>
            <td class="tabular-nums" style="text-align: right;">{pop_fmt.clone()}</td>
            <td class="tabular-nums" style="text-align: right;">{area_fmt.clone()}</td>
            <td>
                <a href=format!("/token/{}", token_slug) style="color: var(--cyber-yellow); text-decoration: none;"
                   on:click=move |ev| { ev.stop_propagation(); }>
                    {token_code.clone()}
                </a>
            </td>
            <td class="tabular-nums" style="text-align: right; color: var(--cyber-orange);">{price_fmt.clone()}</td>
            <td class="tabular-nums" style="text-align: right; color: #888;">{supply_fmt.clone()}</td>
            <td class="tabular-nums" style="text-align: right;">{cap_fmt.clone()}</td>
            <td class="tabular-nums" style:color=freedom_color style="text-align: right; font-weight: 700;">{freedom_str.clone()}</td>
            <td class="tabular-nums" style:color=openness_color style="text-align: right; font-weight: 700;">{openness_str.clone()}</td>
        </tr>
    }
}
