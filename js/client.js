function getClientPage() {
  return `
    <div id="dashboardClient">

      <nav class="barre-navigation">
        <div class="logo-barre">
          <span>🐟</span>
          <span>SenThiof - Client</span>
        </div>
        <div class="menu-barre">
          <span id="nomUtilisateurClient"></span>
          <button onclick="seDeconnecter()">🔓 Déconnexion</button>
        </div>
      </nav>

      <main class="contenu" style="padding: 40px;">
        <h1 class="titre-page">Mes Commandes</h1>

        <div class="section-tableau">
          <h2>Vos commandes</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody id="corpsTableauClient"></tbody>
          </table>
        </div>

        <div style="margin-top: 40px; padding: 20px; background: #fff3e0; border-radius: 8px; border: 2px solid #ff9800;">
          <h2>🛒 Votre panier</h2>
          <table style="width: 100%; margin-bottom: 20px;">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Montant</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="corpsPanier"></tbody>
          </table>
          <div style="text-align: right; font-size: 18px; font-weight: bold; margin-bottom: 20px;">
            Total panier : <span id="totalPanier">0 FCFA</span>
          </div>
          <button class="bouton-connexion" style="background: #4caf50;" onclick="validerCommande()">
            ✅ Valider la commande
          </button>
        </div>

        <div style="margin-top: 40px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
          <h2>Ajouter au panier</h2>
          <form onsubmit="return false">
            <div class="champ">
              <label for="produit">Produit</label>
              <select id="produit">
                <option>Thiof</option>
                <option>Yakh</option>
                <option>Capitaine</option>
                <option>Carpe</option>
                <option>Sole</option>
              </select>
            </div>
            <div class="champ">
              <label for="quantiteCmd">Quantité (kg)</label>
              <input type="number" id="quantiteCmd" placeholder="50" />
            </div>
            <button class="bouton-connexion" onclick="ajouterAuPanier()">
              ➕ Ajouter au panier
            </button>
          </form>
        </div>
      </main>

    </div>
  `;
}
