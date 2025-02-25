import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeSwitcher from "./ThemeSwitcher"; // Le bouton de changement de thème

const Sapin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="35" height="35" className="inline-block">
    <polygon points="32,4 12,28 22,28 10,42 24,42 8,58 56,58 40,42 54,42 42,28 52,28" fill="#228B22" />
    <polygon points="32,0 34,6 40,6 35,10 37,16 32,12 27,16 29,10 24,6 30,6" fill="#FFD700" />
    <rect x="28" y="52" width="8" height="12" fill="#8B4513" />
  </svg>
);

const getSHA256Hash = async (email: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(email.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
export const getGravatarUrl = async (email: string, size: number = 80): Promise<string> => {
  const hash = await getSHA256Hash(email);
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
};

const TopBar: React.FC = () => {
  // Simuler l’état de connexion de l’utilisateur (pour l'exemple)
  const { user, logout } = useAuth()!;
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter((segment) => segment !== "");
  console.log(pathSegments);
  const handleLogout = () => {
    console.log("Déconnexion");
    logout();
    navigate("/login");
  };

  const handleChangePassword = () => {
    console.log("Changement de mot de passe");
  };

  useEffect(() => {
    const fetchGravatar = async () => {
      if (user) {
        const url = await getGravatarUrl(user.email, 40);
        setAvatarUrl(url);
      }
    };

    fetchGravatar();
  }, [user]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-transparent z-50 backdrop-blur-[3px] border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center px-4 py-2 border-b dark:border-gray-700">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Sapin />
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathSegments.length == 2 && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>{pathSegments[1]}</BreadcrumbItem>
              </>
            )}
            {pathSegments.length === 3 && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/simulation/${pathSegments[1]}`}>{pathSegments[1]}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>{pathSegments[2]}</BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Groupe de boutons (droite) */}
        <div className="flex items-center gap-4">
          {/* ThemeSwitcher */}
          <ThemeSwitcher />

          {/* Bouton profil / login */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" />}
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled
                className="font-semibold text-sky-600 dark:text-sky-300 cursor-default justify-center"
              >
                {user!.name}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleChangePassword}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
