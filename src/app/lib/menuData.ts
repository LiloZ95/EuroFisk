import type { Lang } from "./LangContext";

export interface MenuItem { name: string; desc: string; price: string; tag?: string; photo?: string }
export interface MenuCategory { id: string; label: string; items: MenuItem[] }

// Unsplash photo URLs for menu items
const P = {
  fishBalls:      "https://images.unsplash.com/photo-1625489539789-39bb40ed9a8a?w=200&q=80",
  prawnSalad:     "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200&q=80",
  calamari:       "https://images.unsplash.com/photo-1682264895449-f75b342cbab6?w=200&q=80",
  fishSoup:       "https://images.unsplash.com/photo-1560684352-8497838a2229?w=200&q=80",
  bream:          "https://images.unsplash.com/photo-1584300005420-38486f627b07?w=200&q=80",
  seaBass:        "https://images.unsplash.com/photo-1556814901-18c866c057da?w=200&q=80",
  salmon:         "https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=200&q=80",
  dorada:         "https://images.unsplash.com/photo-1666437469803-c6d5ba853a50?w=200&q=80",
  friedFish:      "https://images.unsplash.com/photo-1717465962264-517140fe69b1?w=200&q=80",
  wholeSalmon:    "https://images.unsplash.com/photo-1761095596599-dd7b3bee6287?w=200&q=80",
  mixPlatter:     "https://images.unsplash.com/photo-1519351635902-7c60d09cb2ed?w=200&q=80",
  seafoodBox:     "https://images.unsplash.com/photo-1651352650168-0d7e99dee8e1?w=200&q=80",
  prawnPlatter:   "https://images.unsplash.com/photo-1559742811-822873691df8?w=200&q=80",
  friedPrawns:    "https://images.unsplash.com/photo-1557267725-c530b236f446?w=200&q=80",
  prawnsInSauce:  "https://images.unsplash.com/photo-1550951791-cbf1ff280109?w=200&q=80",
  langoustines:   "https://images.unsplash.com/photo-1504309250229-4f08315f3b5c?w=200&q=80",
  mixedShellfish: "https://images.unsplash.com/photo-1548587468-971ebe4c8c3b?w=200&q=80",
};

export const MENU_DATA: Record<Lang, MenuCategory[]> = {
  sv: [
    {
      id: "forratter", label: "Förrätter",
      items: [
        { name: "Fiskfrikadeller", desc: "Hemlagade fiskbullar med örter och citronaioli", price: "69 kr", photo: P.fishBalls },
        { name: "Räksallad", desc: "Färska räkor med sallad, avokado och citronvinägrett", price: "89 kr", tag: "Ny", photo: P.prawnSalad },
        { name: "Friterade bläckfiskar", desc: "Krispiga bläckfiskar med kryddad dipsås", price: "79 kr", photo: P.calamari },
        { name: "Fisksoppa", desc: "Krämig soppa med dagens fisk, grädde och persilja", price: "85 kr", photo: P.fishSoup },
      ],
    },
    {
      id: "grillat", label: "Grillat",
      items: [
        { name: "Guldsparid", desc: "Hel grillad guldsparid med sallad, bröd och vitlökssås", price: "149 kr", tag: "Populär", photo: P.bream },
        { name: "Havsabborre", desc: "Hel grillad havsabborre med citron, örter och flatbröd", price: "149 kr", photo: P.seaBass },
        { name: "Laxfilé", desc: "Grillad laxfilé med färsk sallad och citronaioli", price: "139 kr", tag: "Klassiker", photo: P.salmon },
        { name: "Dorada", desc: "Hel grillad dorada med grönsakssallad och sås", price: "149 kr", photo: P.dorada },
        { name: "Stekt fisk", desc: "Dagsfångst, panerad och stekt, serveras med ris och sallad", price: "129 kr", photo: P.friedFish },
        { name: "Grillad hel lax", desc: "Hel grillad lax med kryddsmör, citron och örter", price: "169 kr", tag: "Storsäljare", photo: P.wholeSalmon },
      ],
    },
    {
      id: "plattor", label: "Plattor",
      items: [
        { name: "Mix Planka Liten", desc: "Blandning av grillad fisk, räkor och tillbehör — för 1 pers", price: "189 kr", photo: P.mixPlatter },
        { name: "Mix Planka Stor", desc: "Stor blandplatta med fisk och räkor — för 2–3 pers", price: "329 kr", tag: "Dela!", photo: P.mixPlatter },
        { name: "Fiskplanka", desc: "Tre olika fiskar, grillat till perfektion, med bröd och sås", price: "249 kr", photo: P.seaBass },
        { name: "Seafood Box", desc: "Räkor, fisk och skaldjur med dipsås och bröd", price: "219 kr", photo: P.seafoodBox },
        { name: "Familjeplatta", desc: "Stor platta för 4 pers — fisk, räkor, sallad och bröd", price: "549 kr", tag: "Familj", photo: P.mixPlatter },
        { name: "Barnplatta", desc: "Liten portion stekt fisk med ris och sallad — för barn", price: "89 kr", photo: P.friedFish },
      ],
    },
    {
      id: "rakor", label: "Räkor & Skaldjur",
      items: [
        { name: "Räkplanka", desc: "Grillerade king prawns med vitlökssmör, citron och bröd", price: "169 kr", tag: "Populär", photo: P.prawnPlatter },
        { name: "Stekta räkor", desc: "Panerade räkor med kryddad dipsås och sallad", price: "139 kr", photo: P.friedPrawns },
        { name: "Räkor i sås", desc: "Räkor i krämig tomat-chili sås med basmatiris", price: "149 kr", photo: P.prawnsInSauce },
        { name: "Havskräftor", desc: "Grillerade havskräftor med smörsås och citron", price: "185 kr", tag: "Säsong", photo: P.langoustines },
        { name: "Blandade skaldjur", desc: "Musslor, räkor och bläckfisk med vitvinssås och bröd", price: "195 kr", photo: P.mixedShellfish },
      ],
    },
    {
      id: "tillbehor", label: "Tillbehör",
      items: [
        { name: "Extra bröd", desc: "Varmt flatbröd, 2 st", price: "20 kr" },
        { name: "Extra sås", desc: "Vitlöksaioli, chilisås eller citronaioli", price: "15 kr" },
        { name: "Basmatiris", desc: "Fluffigt basmatiris, stor portion", price: "25 kr" },
        { name: "Sallad", desc: "Färsk sallad med citronvinägrett", price: "35 kr" },
      ],
    },
    {
      id: "drycker", label: "Drycker",
      items: [
        { name: "Läsk", desc: "Coca-Cola, Fanta, Sprite — 33cl burk", price: "25 kr" },
        { name: "Vatten", desc: "Fortfarande eller kolsyrat, 50cl", price: "20 kr" },
        { name: "Juice", desc: "Apelsin, mango eller blandad frukt, 33cl", price: "30 kr" },
        { name: "Kaffe", desc: "Bryggkaffe eller espresso", price: "25 kr" },
        { name: "Te", desc: "Svart te, grönt te eller mint", price: "20 kr" },
        { name: "Mango Lassi", desc: "Krämig mangodryck med yoghurt", price: "35 kr", tag: "Ny" },
      ],
    },
  ],
  en: [
    {
      id: "forratter", label: "Starters",
      items: [
        { name: "Fish Balls", desc: "Homemade fish balls with herbs and lemon aioli", price: "69 kr", photo: P.fishBalls },
        { name: "Prawn Salad", desc: "Fresh prawns with salad, avocado and lemon vinaigrette", price: "89 kr", tag: "New", photo: P.prawnSalad },
        { name: "Fried Calamari", desc: "Crispy calamari rings with spiced dipping sauce", price: "79 kr", photo: P.calamari },
        { name: "Fish Soup", desc: "Creamy soup with today's catch, cream and parsley", price: "85 kr", photo: P.fishSoup },
      ],
    },
    {
      id: "grillat", label: "Grilled",
      items: [
        { name: "Gilt-head Bream", desc: "Whole grilled bream with salad, flatbread and garlic sauce", price: "149 kr", tag: "Popular", photo: P.bream },
        { name: "Sea Bass", desc: "Whole grilled sea bass with lemon, herbs and flatbread", price: "149 kr", photo: P.seaBass },
        { name: "Salmon Fillet", desc: "Grilled salmon fillet with fresh salad and lemon aioli", price: "139 kr", tag: "Classic", photo: P.salmon },
        { name: "Dorada", desc: "Whole grilled dorada with vegetable salad and sauce", price: "149 kr", photo: P.dorada },
        { name: "Fried Fish", desc: "Today's catch, breaded and fried, served with rice and salad", price: "129 kr", photo: P.friedFish },
        { name: "Whole Grilled Salmon", desc: "Whole grilled salmon with herb butter, lemon and herbs", price: "169 kr", tag: "Best Seller", photo: P.wholeSalmon },
      ],
    },
    {
      id: "plattor", label: "Platters",
      items: [
        { name: "Mix Platter Small", desc: "Selection of grilled fish, prawns and sides — for 1 person", price: "189 kr", photo: P.mixPlatter },
        { name: "Mix Platter Large", desc: "Large sharing platter with fish and prawns — for 2–3 people", price: "329 kr", tag: "Share!", photo: P.mixPlatter },
        { name: "Fish Platter", desc: "Three different grilled fish, served with bread and sauce", price: "249 kr", photo: P.seaBass },
        { name: "Seafood Box", desc: "Prawns, fish and shellfish with dipping sauce and bread", price: "219 kr", photo: P.seafoodBox },
        { name: "Family Platter", desc: "Large platter for 4 — fish, prawns, salad and bread", price: "549 kr", tag: "Family", photo: P.mixPlatter },
        { name: "Kids Plate", desc: "Small portion of fried fish with rice and salad", price: "89 kr", photo: P.friedFish },
      ],
    },
    {
      id: "rakor", label: "Prawns & Shellfish",
      items: [
        { name: "Prawn Platter", desc: "Grilled king prawns with garlic butter, lemon and bread", price: "169 kr", tag: "Popular", photo: P.prawnPlatter },
        { name: "Fried Prawns", desc: "Breaded prawns with spiced dipping sauce and salad", price: "139 kr", photo: P.friedPrawns },
        { name: "Prawns in Sauce", desc: "Prawns in a creamy tomato-chilli sauce with basmati rice", price: "149 kr", photo: P.prawnsInSauce },
        { name: "Langoustines", desc: "Grilled langoustines with butter sauce and lemon", price: "185 kr", tag: "Seasonal", photo: P.langoustines },
        { name: "Mixed Shellfish", desc: "Mussels, prawns and calamari with white wine sauce and bread", price: "195 kr", photo: P.mixedShellfish },
      ],
    },
    {
      id: "tillbehor", label: "Sides",
      items: [
        { name: "Extra Bread", desc: "Warm flatbread, 2 pieces", price: "20 kr" },
        { name: "Extra Sauce", desc: "Garlic aioli, chilli sauce or lemon aioli", price: "15 kr" },
        { name: "Basmati Rice", desc: "Fluffy basmati rice, large portion", price: "25 kr" },
        { name: "Salad", desc: "Fresh salad with lemon vinaigrette", price: "35 kr" },
      ],
    },
    {
      id: "drycker", label: "Drinks",
      items: [
        { name: "Soft Drink", desc: "Coca-Cola, Fanta, Sprite — 33cl can", price: "25 kr" },
        { name: "Water", desc: "Still or sparkling, 50cl", price: "20 kr" },
        { name: "Juice", desc: "Orange, mango or mixed fruit, 33cl", price: "30 kr" },
        { name: "Coffee", desc: "Filter coffee or espresso", price: "25 kr" },
        { name: "Tea", desc: "Black tea, green tea or mint", price: "20 kr" },
        { name: "Mango Lassi", desc: "Creamy mango drink with yoghurt", price: "35 kr", tag: "New" },
      ],
    },
  ],
};
