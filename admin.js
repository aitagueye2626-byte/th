function getAdminPage() {
  return `
    <div id="dashboardAdmin">

      <nav class="barre-navigation">
        <div class="logo-barre">
          <span>🐟</span>
          <span>SenThiof - Admin</span>
        </div>
        <div class="menu-barre">
          <span id="nomUtilisateurAdmin"></span>
          <button onclick="seDeconnecter()">🔓 Déconnexion</button>
        </div>
      </nav>

      <div class="mise-en-page">

        <aside class="barre-laterale">
          <div class="element-menu actif">📊 Tableau de bord</div>
          <div class="element-menu">🐠 Poisson</div>
          <div class="element-menu">📦 Produits</div>
          <div class="element-menu">🏪 Stock</div>
          <div class="element-menu">🛒 Commandes</div>
        </aside>

        <main class="contenu">

          <h1 class="titre-page">Tableau de bord Admin</h1>

          <div class="metriques">
            <div class="metrique">
              <div class="etiquette">Transactions</div>
              <div class="valeur" id="nbLignesAdmin">—</div>
              <div class="unite">entrées</div>
            </div>
            <div class="metrique">
              <div class="etiquette">Quantité totale</div>
              <div class="valeur" id="totalQteAdmin">—</div>
              <div class="unite">kg</div>
            </div>
            <div class="metrique">
              <div class="etiquette">Montant total</div>
              <div class="valeur" id="totalMontantAdmin">—</div>
              <div class="unite">FCFA</div>
            </div>
            <div class="metrique">
              <div class="etiquette">Top produit</div>
              <div class="valeur" id="topProduitAdmin">—</div>
              <div class="unite">ce mois</div>
            </div>
          </div>

          <div class="section-tableau">
            <h2>Transactions récentes</h2>
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Prix unitaire</th>
                  <th>Montant total</th>
                </tr>
              </thead>
              <tbody id="corpsTableauAdmin"></tbody>
            </table>
          </div>

          <div class="totaux">
            <p>Nombre de transactions : <strong id="totalTransactionsAdmin">—</strong></p>
            <p>Montant général : <strong id="totalGeneralAdmin">—</strong> FCFA</p>
          </div>

        </main>
      </div>

    </div>
  `;
}
