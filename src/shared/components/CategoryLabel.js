import categories from "../constants/categories";
import { useTranslation } from "react-i18next";

const CategoryLabel = (props) => {
  const item = categories.find((item) => item.name === props.category);
  const { t } = useTranslation();

  if (!item) return null;

  return (
    <div
      style={props.style}
      className={`d-flex align-items-center ${props.className}`}
    >
      {item.icon}
      <span className="ms-1">{t(`categories.${item.name.toLocaleLowerCase()}`)}</span>
    </div>
  );
};

export default CategoryLabel;
