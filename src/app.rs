use leptos::prelude::*;
use leptos_router::components::*;
use leptos_router::path;

use crate::pages::home::HomePage;
use crate::pages::country::CountryPage;
use crate::pages::token::TokenPage;
use crate::pages::map::MapPage;

#[component]
pub fn App() -> impl IntoView {
    view! {
        <Router>
            <Routes fallback=|| view! { <p style="color: var(--cyber-red); padding: 40px;">"404 — NOT FOUND"</p> }>
                <Route path=path!("/") view=HomePage />
                <Route path=path!("/map") view=MapPage />
                <Route path=path!("/country/:code") view=CountryPage />
                <Route path=path!("/token/:code") view=TokenPage />
            </Routes>
        </Router>
    }
}
