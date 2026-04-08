# Cyberstate Protocol

## Foundation

Every state is a protocol. Every organized human activity — from a person managing their life to a nation governing 100 million citizens — runs on the same five concepts:

```
GRAPH      — state       — who has what, who is linked to whom
TOKENS     — objects     — what moves through the system
WORKFLOW   — rules       — how things move
CALENDAR   — time        — when things move
DOCUMENTS  — proof       — that things moved
```

That's it. Everything else is configuration.

---

## The Five Concepts

### Graph

The graph is the world state. Every person, organization, parcel of land, vehicle, and idea is a node. Every relationship — ownership, employment, citizenship, marriage, tenancy, membership — is an edge. Every edge has a type, an optional quantity, a validity period, and a history.

A person's entire relationship with reality is their node and its edges. You own an apartment: that's an edge. You work for a company: that's an edge. You hold €5,000 in a bank: that's an edge with a quantity. You are a citizen of France: that's an edge with an indefinite validity period.

The graph is identical in structure at every scale. A person's contacts list, a company's org chart, a city's population register, a nation's cadastre — all the same data structure. Nodes and edges.

When people say "ledger" they mean the graph filtered to edges where the object is a fungible token. When they say "inventory" they mean the graph filtered to edges where the object is a non-fungible physical item. When they say "registry" they mean the graph filtered to edges between entities. These are views, not separate systems.

### Tokens

Tokens are the things that move through the graph. Not just money — everything.

| Token type | Fungible | Transferable | Expires | Revocable | Examples |
|-----------|:--------:|:------------:|:-------:|:---------:|---------|
| Currency | yes | yes | no | no | USD, EUR, BTC |
| Title | no | yes | no | no | Land deed, vehicle registration |
| Permit | no | sometimes | yes | yes | Visa, building permit, trade license |
| Credential | no | no | yes | yes | Passport, medical license, diploma |
| Vote | no | no | yes | no | Election ballot |
| Claim | no | yes | yes | yes | Insurance policy, pension right |
| Share | yes | yes | no | no | Company equity, coop membership |
| Record | no | no | no | no | Birth certificate, death record, court judgment |

Every object in the old model — passport, ID card, building permit, employment contract, marriage certificate, patent — is a token. It gets minted, assigned to a holder, optionally transferred, and eventually expires or gets revoked. The lifecycle is the same for all of them.

A state is fundamentally a token factory. It mints tokens (passports, permits, titles, currency), defines who can hold them, sets the rules for how they move, and maintains the authoritative record of who holds what.

### Workflow

A workflow defines how tokens move. Every method in the system — buying land, getting a visa, forming a company, going to court — is a sequence of steps that moves tokens between nodes in the graph, with gates that require approvals or conditions.

```
land.buy():
  offer → accept → sign → pay → transfer_title → register
  
  At each step:
  - Who can advance it? (buyer, seller, notary, registry)
  - What tokens move? (payment at "pay", title at "transfer_title")
  - What conditions? (buyer must have funds, parcel must not be encumbered)
```

A simple workflow is one step: `identity.enter()` for a visa-free country is just `stamp → done`. A complex workflow has many steps with branching: a court case can split into appeal, settlement, enforcement, each with its own sub-workflow.

The rules encoded in workflows are what differentiate states. Georgia's `entity.mint()` workflow is: apply online → pay $50 → done in 1 day. America's is: choose state → file articles → get EIN → open bank account → done in 2 weeks. The workflow steps are different, the costs are different, the time is different. Same method, different configuration.

### Calendar

Calendar binds workflows to time. Every token has temporal properties — when it was created, when it's valid, when it expires. Every workflow step has a schedule — when it can be executed, how long it takes, what deadlines apply.

A visa token is valid from entry date to entry date + 90 days. A building permit expires in 24 months if construction hasn't started. A court hearing is scheduled for a specific date and time. A tax filing is due by April 15. A pension can be withdrawn after age 65.

Calendar is not a separate system — it's the time dimension of the graph. Every edge has `valid_from` and `valid_to`. Every workflow step has `scheduled_at` and `deadline`. But it's important enough to call out as its own concept because temporal constraints are where most bureaucratic complexity lives.

### Documents

Documents are signed proof that a state change happened. When a token moves from A to B, a document records the transaction — who, what, when, and the cryptographic or institutional signatures that authenticate it.

A title deed is a document that proves `land.buy()` happened. A marriage certificate is a document that proves `identity.record_union()` happened. A court judgment is a document that proves `justice.file_claim()` reached a resolution. A receipt is a document that proves `tokens.send()` happened.

Documents are the transaction log of the graph. They are append-only — you can't delete a document, only revoke it by issuing a new document that supersedes it. This is why governments keep registries of certificates, deeds, judgments, and filings — they are maintaining the transaction history of the state graph.

---

## How the Five Compose

Every government service is the same operation: **move tokens through a workflow on a calendar, record it as a document, update the graph.**

```
identity.enter():
  graph:    add edge (person → state, "visitor")
  token:    mint ENTRY_PERMIT, assign to person
  workflow: apply → review → approve → stamp
  calendar: valid_from = today, valid_to = today + 90 days
  document: entry stamp in passport

land.buy():
  graph:    move edge (parcel → old_owner) to (parcel → new_owner)
  token:    transfer TITLE from seller to buyer
  workflow: offer → accept → sign → pay → transfer → register
  calendar: completion deadline = 30 days from signing
  document: deed of sale, title certificate

entity.mint("LLC"):
  graph:    create node (new entity), add edges (members → entity)
  token:    mint ENTITY_REGISTRATION, assign to founders
  workflow: file → review → approve → issue
  calendar: processing time = 1-30 days depending on state
  document: certificate of incorporation

health.emergency.call():
  graph:    create edge (person → hospital, "patient")
  token:    mint PRIORITY_CARE, assign to person
  workflow: call → dispatch → arrive → treat → discharge
  calendar: response time = immediate
  document: medical record

governance.vote():
  graph:    add edge (person → candidate, "voted_for")
  token:    consume BALLOT (one-time use)
  workflow: authenticate → cast → confirm
  calendar: election day, polls open 8:00-20:00
  document: anonymous ballot receipt
```

---

## Tiers

A person's relationship with a state determines which tokens they can hold and which workflows they can initiate. This relationship has four depths:

| Tier | Duration | What it means |
|------|----------|--------------|
| **VISIT** | days/weeks | You are physically present. The state knows you exist because you crossed the border. You can hold temporary tokens: entry permit, tourist SIM, emergency care. |
| **STAY** | months/years | You have registered in the system. The state has your address. You can hold medium-term tokens: bank account, work permit, business registration, insurance. |
| **SETTLE** | years/decade | You are permanently established. The state considers you a long-term stakeholder. You can hold permanent tokens: property title, permanent residence, pension, professional credentials. |
| **BELONG** | forever | You are a full member of the state. You hold the governance token: passport, voting rights, right to run for office. The state will protect you anywhere on Earth. You can pass tokens to the next generation. |

Each tier is a superset of the previous. BELONG includes everything from SETTLE, which includes everything from STAY, which includes everything from VISIT. Moving up the tiers is a one-way ratchet — each step requires the previous step and typically years of demonstrated commitment.

The tiers are a permission model. They determine not which methods exist — every state has the same 81 methods — but which methods a specific person can call.

---

## Space and Hierarchy

The graph does not float in a vacuum. It is anchored to physical space. Every node in the graph — every person, parcel, vehicle, entity — has a location. That location determines which state's protocol governs it.

Jurisdictions nest:

```
Earth
└── Treaty body (EU, ASEAN, AU)
    └── State (France, Georgia, Japan)
        └── Region (Île-de-France, Kakheti)
            └── Municipality (Paris, Tbilisi)
                └── District
                    └── Parcel
                        └── Unit
```

At each level, the parent's rules apply unless the child explicitly overrides them. France sets income tax at 30%. A free zone within France might override that to 0% for qualifying entities. The EU sets minimum VAT at 15%. France sets it at 20%. Both apply — the more specific level wins for its scope.

This cascading hierarchy means the graph is not one flat namespace. It is a tree of nested graphs, each with its own token rules, workflow configurations, and calendar constraints, inheriting from its parent and optionally overriding.

Every person navigates this hierarchy by physical movement and voluntary subscription. Standing in Paris subscribes you to Paris → France → EU → Earth rules. Moving to Tbilisi unsubscribes you from France and subscribes you to Tbilisi → Georgia → Earth rules. Taking a job subscribes you to your employer's rules within its jurisdiction. Forming a family subscribes you to family law in your jurisdiction. Every entry is consent. Every exit is withdrawal.

The only involuntary subscription is birth: you arrive in a jurisdiction and a family you did not choose. Everything after that is voluntary navigation of the hierarchy.

---

## Methods

Methods are the public API — the 81 specific workflows a person can initiate. Each method moves specific tokens through a specific workflow. Each state configures each method with its own tier requirements, costs, timelines, and prerequisites.

### 1. IDENTITY (11)

Identity methods mint and manage the tokens that represent who you are, what you can do, and what has happened to you. These are the most fundamental methods — almost every other method requires at least `identity.enter()` or `identity.register()` as a prerequisite.

| Method | Tokens involved |
|--------|----------------|
| `identity.enter()` | mints ENTRY_PERMIT |
| `identity.register(address)` | mints REGISTRATION, TAX_ID |
| `identity.issue_id()` | mints STATE_ID |
| `identity.issue_passport()` | mints PASSPORT |
| `identity.issue_credential(type)` | mints CREDENTIAL (medical, legal, engineering, pilot, driver...) |
| `identity.issue_digital_id()` | mints DIGITAL_ID (e-signature, e-government access) |
| `identity.record_birth(child)` | mints BIRTH_RECORD, initial CITIZENSHIP |
| `identity.record_death(person)` | mints DEATH_RECORD, triggers inheritance workflows |
| `identity.record_union(a, b)` | mints MARRIAGE_RECORD, modifies both persons' graph edges |
| `identity.dissolve_union(a, b)` | revokes MARRIAGE_RECORD, modifies graph |
| `identity.change_name(new)` | updates IDENTITY tokens |

### 2. TOKENS (7)

Token methods manage the flow of value — the state's currency and the financial instruments built on top of it.

| Method | Tokens involved |
|--------|----------------|
| `tokens.open_account()` | mints ACCOUNT (wallet for state currency) |
| `tokens.send(to, amount)` | transfers CURRENCY |
| `tokens.borrow(amount, term)` | mints LOAN, transfers CURRENCY |
| `tokens.exchange(from, to)` | swaps CURRENCY tokens |
| `tokens.insure(type, coverage)` | mints INSURANCE_POLICY (claim token) |
| `tokens.stake_pension(amount)` | locks CURRENCY, mints PENSION_RIGHT |
| `tokens.withdraw_pension()` | burns PENSION_RIGHT, releases CURRENCY |

### 3. LAND (7)

Land methods manage the tokens that represent physical space — the original non-fungible tokens.

| Method | Tokens involved |
|--------|----------------|
| `land.lookup(parcel_id)` | reads TITLE (no token movement) |
| `land.buy(parcel_id)` | transfers TITLE, transfers CURRENCY |
| `land.sell(parcel_id)` | transfers TITLE, transfers CURRENCY |
| `land.lease(parcel_id, term)` | mints LEASE (nested: owner→tenant→subtenant) |
| `land.inherit(parcel_id, heir)` | transfers TITLE via DEATH_RECORD trigger |
| `land.build(parcel_id, spec)` | mints BUILDING_PERMIT, then OCCUPANCY_CERT |
| `land.demolish(parcel_id)` | mints DEMOLITION_PERMIT, burns OCCUPANCY_CERT |

### 4. ENTITIES (6)

Entity methods manage the tokens that represent organizations — groups of people with shared rules and assets.

| Method | Tokens involved |
|--------|----------------|
| `entity.mint(type, members)` | mints ENTITY_REGISTRATION, SHARES to founders |
| `entity.dissolve(entity_id)` | burns ENTITY_REGISTRATION, distributes remaining tokens |
| `entity.add_member(entity_id, person)` | mints or transfers SHARE/MEMBERSHIP |
| `entity.remove_member(entity_id, person)` | burns or transfers back SHARE/MEMBERSHIP |
| `entity.register_ip(type, desc)` | mints IP_TOKEN (patent, trademark, copyright) |
| `entity.transfer_ip(ip_id, to)` | transfers IP_TOKEN |

### 5. WORK (4)

Work methods manage the tokens that represent employment and freelance relationships.

| Method | Tokens involved |
|--------|----------------|
| `work.employ(person, entity, terms)` | mints EMPLOYMENT_CONTRACT, WORK_PERMIT if needed |
| `work.terminate(contract_id)` | burns EMPLOYMENT_CONTRACT |
| `work.freelance.register()` | mints FREELANCER_REGISTRATION |
| `work.freelance.contract(client, terms)` | mints SERVICE_CONTRACT |

### 6. MOBILITY (5)

Mobility methods manage movement tokens — permissions to operate vehicles and use infrastructure.

| Method | Tokens involved |
|--------|----------------|
| `mobility.use_transit(route)` | consumes TRANSIT_TICKET or TRANSIT_PASS |
| `mobility.issue_license(type)` | mints DRIVER_LICENSE (credential token) |
| `mobility.register_vehicle(vehicle)` | mints VEHICLE_REGISTRATION |
| `mobility.transfer_vehicle(vehicle, to)` | transfers VEHICLE_REGISTRATION |
| `mobility.deregister_vehicle(vehicle)` | burns VEHICLE_REGISTRATION |

### 7. HEALTH (4)

Health methods manage care tokens — access to medical services.

| Method | Tokens involved |
|--------|----------------|
| `health.emergency.call()` | mints EMERGENCY_CARE (immediate, unconditional) |
| `health.care.book(type, provider)` | mints APPOINTMENT |
| `health.care.admit(facility)` | mints ADMISSION |
| `health.prescribe(medication)` | mints PRESCRIPTION |

### 8. EDUCATION (3)

Education methods manage learning tokens — enrollment and credentials.

| Method | Tokens involved |
|--------|----------------|
| `education.enroll(level, institution)` | mints ENROLLMENT |
| `education.graduate(institution)` | mints DIPLOMA (credential token) |
| `education.certify(skill)` | mints CREDENTIAL → feeds into identity.issue_credential() |

### 9. COMMS (4)

Communications methods manage connectivity tokens.

| Method | Tokens involved |
|--------|----------------|
| `comms.connect(type)` | mints CONNECTION (phone number, internet, postal address) |
| `comms.disconnect(type)` | burns CONNECTION |
| `comms.data.export()` | reads (no token movement — data portability right) |
| `comms.data.delete()` | burns PERSONAL_DATA tokens held by third parties |

### 10. JUSTICE (5)

Justice methods manage protection and dispute resolution tokens.

| Method | Tokens involved |
|--------|----------------|
| `justice.emergency.call()` | mints EMERGENCY_RESPONSE |
| `justice.file_claim(against, type)` | mints CASE |
| `justice.enforce(judgment_id)` | executes JUDGMENT — forcibly moves tokens as ordered |
| `justice.appeal(judgment_id)` | mints APPEAL on existing CASE |
| `justice.consular.request(country)` | mints CONSULAR_PROTECTION (abroad) |

### 11. GOVERNANCE (4)

Governance methods manage the meta-tokens — the ones that control how the protocol itself changes.

| Method | Tokens involved |
|--------|----------------|
| `governance.vote(election_id)` | consumes BALLOT (one-time use token) |
| `governance.run(office_id)` | mints CANDIDACY |
| `governance.petition(proposal)` | mints PETITION |
| `governance.assembly(purpose)` | mints ASSEMBLY_PERMIT |

### 12. FAMILY (4)

Family methods manage biological and generational tokens.

| Method | Tokens involved |
|--------|----------------|
| `family.reunify(person, relation)` | mints FAMILY_VISA |
| `family.adopt(child)` | transfers CUSTODY, mints ADOPTION_RECORD |
| `family.custody.assign(child, parent)` | transfers CUSTODY |
| `family.inherit(estate, heirs)` | distributes all tokens of deceased per WILL or law |

### 13. GRID (5)

Grid methods manage infrastructure connection tokens.

| Method | Tokens involved |
|--------|----------------|
| `grid.connect(parcel_id, utility)` | mints UTILITY_CONNECTION (water, electric, gas, sewage) |
| `grid.disconnect(parcel_id, utility)` | burns UTILITY_CONNECTION |
| `grid.use_road(route)` | consumes TOLL_PASS or pays per use |
| `grid.waste.collect(address)` | ongoing service token — WASTE_SERVICE |
| `grid.waste.dispose(type)` | consumes DISPOSAL_PERMIT for special waste |

### 14. MARKETS (9)

Market methods manage exchange tokens — the interfaces where supply meets demand.

| Method | Tokens involved |
|--------|----------------|
| `market.labour.post(job)` | mints JOB_LISTING |
| `market.labour.apply(job)` | mints APPLICATION |
| `market.services.offer(service)` | mints SERVICE_LISTING |
| `market.services.buy(service)` | mints SERVICE_CONTRACT, transfers CURRENCY |
| `market.goods.sell(item)` | transfers ITEM, receives CURRENCY |
| `market.goods.buy(item)` | transfers CURRENCY, receives ITEM |
| `market.deliver(from, to, package)` | mints SHIPPING_CONTRACT |
| `market.import(goods, origin)` | mints IMPORT_DECLARATION, clears CUSTOMS |
| `market.export(goods, destination)` | mints EXPORT_DECLARATION, clears CUSTOMS |

### 15. DEFENSE (3)

Defense methods manage collective security tokens.

| Method | Tokens involved |
|--------|----------------|
| `defense.enlist()` | mints MILITARY_SERVICE |
| `defense.asylum.claim(type)` | mints ASYLUM_APPLICATION |
| `defense.clearance.request(level)` | mints SECURITY_CLEARANCE |

---

## Product Grid

The product grid is Layer 4 — the instantiation of this protocol across 229 states. Each state implements the same 81 methods but with different parameters:

- **Tier** — minimum relationship depth required (visit, stay, settle, belong)
- **Cost** — what the state charges for the method call
- **Time** — how long the workflow takes to complete
- **Requires** — prerequisites (other methods that must have completed first)

These four parameters, across 81 methods and 229 states, produce roughly 74,000 data points. This is the complete product catalog of human governance on Earth.

A person choosing where to live is shopping this catalog. A business choosing where to incorporate is shopping this catalog. A family choosing where to raise children is shopping this catalog. The information exists — scattered across embassy websites, immigration lawyer blogs, government portals, and local knowledge. This protocol unifies it into one queryable structure.

---

## Scale Invariance

The five concepts — graph, tokens, workflow, calendar, documents — operate identically at every scale of human organization.

A person runs their life with them. Their bank statement is a graph of token movements. Their to-do list is a workflow. Their calendar is a calendar. Their file cabinet is a document store. Their contacts are a graph.

A business runs with them. ERP systems — SAP, Oracle, Odoo — are configurations of these five concepts with domain-specific interfaces. Every ERP module maps to them: financial accounting is the graph filtered to currency tokens, HR is the graph filtered to employment edges, procurement is a workflow that moves inventory tokens, project management is workflows bound to calendar constraints.

A city runs with them. Municipal budgets, building permits, population registers, public transit schedules, court dockets — all five concepts at civic scale.

A state runs with them. National treasuries, land cadastres, visa systems, legislative processes, international treaties — all five concepts at sovereign scale.

The only thing that changes between a person and a state is the number of participants, the volume of data, and the permission model. The architecture is identical. This is not an analogy. It is a literal description of how organized human activity works.

---

## Summary

```
FIVE CONCEPTS:

  GRAPH      — state       — who has what
  TOKENS     — objects     — what moves
  WORKFLOW   — rules       — how things move
  CALENDAR   — time        — when things move
  DOCUMENTS  — proof       — that things moved

ANCHORED BY:

  SPACE      — location selects jurisdiction
  HIERARCHY  — rules cascade from parent to child
  CONSENT    — entry and exit are voluntary

EXPOSED AS:

  81 METHODS across 15 clusters
  229 STATES each with different (tier, cost, time, requires)
  74,000 DATA POINTS — the complete product catalog of human governance
```
