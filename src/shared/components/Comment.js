import React from "react";
import formatDate from "../utils/formatDate";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Comment = ({ comment, onDelete }) => {
  const { userId } = useContext(AuthContext);
  const isAuthor = comment.author?.id === userId;


  return (
    <Wrapper>
      <div className="me-3">
        <p className="mb-3">
          <Link className="card-link" to={`/users/${comment.author?.id}`}>
            {comment.author?.username}{" "}
          </Link>
          <span className="ms-2 text-muted">{formatDate(comment.posted)}</span>
        </p>
        <p>{comment.content}</p>
      </div>

      {isAuthor && (
        <div className="d-flex justify-content-end h-25" >
          <button className="btn btn-sm btn-outline-danger" onClick={()=>onDelete(comment)}>
            <i style={{ fontSize: "12px" }} className="bi bi-trash"></i>
          </button>
        </div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-size: 14px;
  border-bottom: 1px solid gainsboro;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 2rem 0 0.5rem 0;

`;

export default Comment;
