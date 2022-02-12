import React, { useEffect, useState, useContext } from "react";
import formatDate from "../utils/formatDate";
import useHttp from "../hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Comments = ({ itemId, itemType }) => {
  const { fetchData, sendItem } = useHttp();
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { userId, token } = useContext(AuthContext);

  const submitHandler = async function (event) {
    event.preventDefault();
    const formData = new FormData();

    formData.append("content", newComment);
    formData.append("author", userId);

    try {
      await sendItem({
        method: "POST",
        api: `comments/${itemId}`,
        type: itemType,
        body: formData,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetchData(`comments/${itemId}?type=${itemType}`);
        const { comments } = response;

        setCommentList(comments);
      } catch (err) {}
    };
    try {
      fetchComments();
    } catch (err) {}
  }, [itemId]);

  return (
    <div>
      <form onSubmit={submitHandler}>
        <textarea
          className="form-control"
          name="content"
          placeholder="Write comment..."
          onChange={(e) => {
            setNewComment(e.target.value);
          }}
          value={newComment}
        ></textarea>
        {!!newComment && (
          <button className="btn btn-success" type="submit">
            Send
          </button>
        )}
      </form>
      {commentList.map((item) => {
        return (
          <div>
            <h6>
              {item.author?.username}{" "}
              <span className="ms-2 text-muted">{formatDate(item.posted)}</span>
            </h6>
            <p>{item.content}</p>
          </div>
        )
      })}
    </div>
  );
};

export default Comments;
