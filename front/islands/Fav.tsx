import { FunctionComponent } from "preact";

type Props = {
  id: string;
  fav: boolean;
};

const Fav: FunctionComponent<Props> = ({ id, fav }) => {
  const toggleFav = (id: string) => {
    // TODO
  };
  return (
    <button className="fav-button" onClick={() => toggleFav(id)}>
      {fav ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
    </button>
  );
};

export default Fav;
