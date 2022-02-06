import { FaTree } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import { MdMuseum } from "react-icons/md";
import { FaLandmark } from "react-icons/fa";
import { MdCelebration } from "react-icons/md";
import { MdHotel } from "react-icons/md";

const categories = [
  { name: "Nature", icon: <FaTree /> },
  { name: "Food", icon: <MdRestaurant /> },
  { name: "Museum", icon: <MdMuseum /> },
  { name: "Landmark", icon: <FaLandmark /> },
  { name: "Event", icon: <MdCelebration /> },
  { name: "Accomodation", icon: <MdHotel /> },
];

export default categories;
