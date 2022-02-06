
const Item = ({ photo, onSelect, onDeselect, selected }) => {
  return (
    <div
      className="grid-item"
      style={{ marginBottom: "10px", marginLeft: "10px" }}
      onClick={() => {
        if (!selected) {
          onSelect();
        } else {
          onDeselect();
        }
      }}
    >
      {selected && <div className="overlay"> </div>}
      {selected && (
        <i
          className="bi bi-check-square-fill check-icon"
          style={{ color: "black" }}
        ></i>
      )}
      <img src={photo.urls.thumb}
      // style={{width:'100%'}}
      className="mx-auto"
      alt={photo.alt} />
    </div>
  );
};

export default Item;
