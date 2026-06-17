const BASE_URL = "http://localhost:3000";
function getUtilisateurs() {
  return fetch(`${BASE_URL}/utilisateurs`).then(res => res.json());
}

function connecterUtilisateur(email, motdepasse) {
  return fetch(`${BASE_URL}/utilisateurs`)
    .then(res => res.json())
    .then(users => {
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.motdepasse === motdepasse
      );
      return user || null;
    });
}

function ajouterUtilisateur(utilisateur) {
  return fetch(`${BASE_URL}/utilisateurs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(utilisateur)
  }).then(res => res.json());
}

function supprimerUtilisateur(id) {
  return fetch(`${BASE_URL}/utilisateurs/${id}`, {
    method: "DELETE"
  }).then(res => res.json());
}

function getProduits() {
  return fetch(`${BASE_URL}/produits`).then(res => res.json());
}

function ajouterProduit(produit) {
  return fetch(`${BASE_URL}/produits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produit)
  }).then(res => res.json());
}

function modifierProduit(id, produit) {
  return fetch(`${BASE_URL}/produits/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produit)
  }).then(res => res.json());
}

function supprimerProduit(id) {
  return fetch(`${BASE_URL}/produits/${id}`, {
    method: "DELETE"
  }).then(res => res.json());
}

function getTransactions() {
  return fetch(`${BASE_URL}/transactions`).then(res => res.json());
}

function ajouterTransaction(transaction) {
  return fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction)
  }).then(res => res.json());
}

function getPanier() {
  return fetch(`${BASE_URL}/paniers`).then(res => res.json());
}

function ajouterAuPanierAPI(article) {
  return fetch(`${BASE_URL}/paniers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(article)
  }).then(res => res.json());
}

function viderPanier() {
  return getPanier().then(articles => {
    const suppressions = articles.map(a =>
      fetch(`${BASE_URL}/paniers/${a.id}`, { method: "DELETE" })
    );
    return Promise.all(suppressions);
  });
}

function getStocks() {
  return fetch(`${BASE_URL}/stocks`).then(res => res.json());
}