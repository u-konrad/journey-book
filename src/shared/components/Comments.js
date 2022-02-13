import React, { useEffect, useState, useContext, useCallback } from "react";
import useHttp from "../hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Comment from "./Comment";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";

const Comments = ({ itemId, itemType }) => {
  const { fetchData, sendItem } = useHttp();
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { userId, token } = useContext(AuthContext);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetchData(`comments/${itemId}?type=${itemType}`);
      const { comments } = response;

      setCommentList(comments);
    } catch (err) {}
  }, [itemId, itemType]);

  const deleteHandler = async (comment) => {
    try {
      await sendItem({
        method: "DELETE",
        api: `comments/${comment._id}`,
        type: itemType,
        body: JSON.stringify({
          authorId: comment.author.id,
          parentId: itemId,
          parentType: itemType,
        }),
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      fetchComments();
    } catch (err) {}
  };

  const submitHandler = async function (event) {
    event.preventDefault();

    try {
      await sendItem({
        method: "POST",
        api: `comments/${itemId}`,
        type: itemType,
        body: JSON.stringify({ content: newComment, author: userId }),
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });

      fetchComments();
      setNewComment("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    try {
      fetchComments();
    } catch (err) {}
  }, [fetchComments]);

  return (
    <Wrapper>
      {!!token ? (
        <form onSubmit={submitHandler}>
          <TextareaAutosize
            className="form-control"
            name="content"
            placeholder="Write a comment..."
            minRows={2}
            maxRows={10}
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
            value={newComment}
          ></TextareaAutosize>
          {!!newComment && (
            <div className="d-flex justify-content-end mt-2">
              <button className="btn btn-success" type="submit">
                Send
              </button>
            </div>
          )}
        </form>
      ) : (
        <p className="lead">Log in to write a comment.</p>
      )}
      {commentList.map((item) => {
        return <Comment comment={item} onDelete={deleteHandler} />;
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid grey;
`;

export default Comments;
