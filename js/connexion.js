function getConnexionPage() {
  return `
    <div id="pageConnexion">

      <div class="aita">

        <div class="aita-gauche">

          <img src="logo.png" alt="Logo SenThiof" class="aita-image" />

          <div class="aita-nom">SenThiof</div>

        </div>

        <div class="aita-droite">

          <div class="logo-zone">
            <div class="logo-cercle">🐟</div>
            <div class="nom-app">SenThiof</div>
          </div>

          <div id="formuConnexion">
            <p class="titre-connexion">Bienvenue !</p>
            <p class="sous-titre-connexion">Connectez-vous pour accéder à votre espace</p>

            <form onsubmit="return false">

              <div class="champ">
                <label for="email">Adresse e-mail</label>
                <input type="email" id="email" placeholder="exemple@senthiof.sn" />
              </div>

              <div class="champ">
                <label for="motdepasse">Mot de passe</label>
                <input type="password" id="motdepasse" placeholder="••••••••" />
              </div>

              <div class="erreur" id="messageErreur"></div>

              <button class="bouton-connexion" onclick="seConnecter()">
                Se connecter →
              </button>

            </form>

            <p style="text-align: center; margin-top: 16px; font-size: 14px; color: #666;">
              Pas de compte ? 
              <a href="#" onclick="afficherInscription(); return false;" style="color: #1565c0; font-weight: 600;">S'inscrire</a>
            </p>
          </div>

          <div id="formuInscription" class="cache">
            <p class="titre-connexion">Créer un compte</p>
            <p class="sous-titre-connexion">Rejoignez SenThiof dès maintenant !</p>

            <form onsubmit="return false">

              <div class="champ">
                <label for="nomInscription">Nom complet</label>
                <input type="text" id="nomInscription" placeholder="Votre nom" />
              </div>

              <div class="champ">
                <label for="emailInscription">Adresse e-mail</label>
                <input type="email" id="emailInscription" placeholder="exemple@senthiof.sn" />
              </div>

              <div class="champ">
                <label for="motdepasseInscription">Mot de passe</label>
                <input type="password" id="motdepasseInscription" placeholder="••••••••" />
              </div>

              <div class="champ">
                <label for="confirmerMotdepasse">Confirmer le mot de passe</label>
                <input type="password" id="confirmerMotdepasse" placeholder="••••••••" />
              </div>

              <div class="champ">
                <label for="roleInscription">Je m'inscris en tant que</label>
                <select id="roleInscription" style="width: 100%; padding: 12px 16px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; background-color: #fafafa;">
                  <option value="client">🛒 Client (Acheter du poisson)</option>
                  <option value="mareyeur">🐟 Mareyeur (Vendre du poisson)</option>
                </select>
              </div>

              <div class="erreur" id="messageErreurInscription"></div>

              <button class="bouton-connexion" onclick="sInscrire()">
                Créer mon compte →
              </button>

            </form>

            <p style="text-align: center; margin-top: 16px; font-size: 14px; color: #666;">
              Déjà inscrit ? 
              <a href="#" onclick="afficherConnexion(); return false;" style="color: #1565c0; font-weight: 600;">Se connecter</a>
            </p>
          </div>

        </div>

      </div>

    </div>
  `;
}
