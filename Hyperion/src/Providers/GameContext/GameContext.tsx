import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../Services/api";
import { IDefaultProvidersProps } from "../UserContext/@types";
import { ICategories, IGameContext, IGames } from "./@types";

export const GameContext = createContext<IGameContext>({} as IGameContext);

export const GameProvider = ({ children }: IDefaultProvidersProps) => {
  const [games, setGames] = useState<IGames[]>([]);
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [currentSale, setCurrentSale] = useState<IGames[]>([]);

  const getGames = async () => {
    try {
      const response = await api.get("/products");
      setGames(response.data);
      console.log(response);
      console.log(games);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGames();
    console.log("Aqui");
  }, []);

  const getCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addProduct = (product: IGames) => {
    if (!currentSale.some((item) => item.id === product.id)) {
      setCurrentSale([...currentSale, { ...product }]);
      localStorage.setItem(
        "@PRODUCTLIST",
        JSON.stringify([...currentSale, { ...product }])
      );

      toast.success("produto adicionado no carrinho!", {
        autoClose: 1000,
      });
    } else {
      toast.error("Este produto já foi adicionado!", {
        autoClose: 1000,
      });
    }
  };

  const removeProduct = (product: IGames) => {
    const newCartProduct = currentSale.filter((sale) => sale.id !== product.id);
    setCurrentSale(newCartProduct);
    localStorage.setItem("@PRODUCTLIST", JSON.stringify(newCartProduct));
    toast.success("Produto removido do carrinho!", {
      autoClose: 1000,
    });
  };

  const removeAllProduct = () => {
    setCurrentSale([]);
    localStorage.removeItem("@PRODUCTLIST");
    toast.success("Carrinho limpo!", {
      autoClose: 1000,
    });
  };

  return (
    <GameContext.Provider
      value={{ games, categories, addProduct, removeProduct, removeAllProduct }}
    >
      {children}
    </GameContext.Provider>
  );
};
