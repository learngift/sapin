/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer, Model, Response } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  const server = createServer({
    environment,

    models: {
      user: Model.extend({ name: "", email: "", password: "" }),
    },

    seeds(server) {
      server.create("user", {
        id: "1",
        name: "Jef",
        email: "e70838@gmail.com",
        password: "x",
      });
      server.create("user", {
        id: "2",
        name: "Henri",
        email: "henri@example.com",
        password: "x",
      });
    },

    routes() {
      this.namespace = "api"; // Toutes les requêtes passeront par /api

      this.post("/login", (schema: any, request: any) => {
        const attrs = JSON.parse(request.requestBody);
        const { email, password } = attrs;

        // Recherche de l'utilisateur correspondant
        const user = schema.users.findBy({ email });

        if (!user) {
          return new Response(401, {}, { error: "Utilisateur non trouvé" });
        }

        if (user.password !== password) {
          return new Response(401, {}, { error: "Mot de passe incorrect" });
        }

        // Simulation d'un token JWT
        const token = btoa(`${email}:${password}`);

        return {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        };
      });

      // ✅ Route de déconnexion
      this.post("/logout", () => {
        // Ici, aucune logique réelle, juste un retour d'état simulé
        return new Response(200, {}, { message: "Déconnexion réussie" });
      });

      this.passthrough();
    },
  });

  return server;
}
