import React, { useState } from "react";
import "./CommentItem.scss";
import type { Comment } from "../../services/commentService";

interface CommentItemProps {
  comment: Comment;
  currentUserId: number | null;
  onEdit: (commentId: number, newMessage: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
  onReply: (parentId: number, message: string) => Promise<void>;
  depth?: number;
}

/**
 * Component to display a single comment with nested replies
 * Supports edit, delete, and reply actions
 */
const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
  depth = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editMessage, setEditMessage] = useState(comment.mensaje);
  const [replyMessage, setReplyMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = currentUserId === comment.usuarioId;
  const maxDepth = 2; // Limitar profundidad de respuestas

  const handleEdit = async () => {
    if (!editMessage.trim()) {
      alert("El comentario no puede estar vacío");
      return;
    }

    try {
      await onEdit(comment.id, editMessage);
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing comment:", error);
      alert("No se pudo editar el comentario");
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este comentario?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("No se pudo eliminar el comentario");
      setIsDeleting(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      alert("La respuesta no puede estar vacía");
      return;
    }

    try {
      await onReply(comment.id, replyMessage);
      setReplyMessage("");
      setIsReplying(false);
    } catch (error) {
      console.error("Error replying to comment:", error);
      alert("No se pudo publicar la respuesta");
    }
  };

  const handleCancelEdit = () => {
    setEditMessage(comment.mensaje);
    setIsEditing(false);
  };

  const handleCancelReply = () => {
    setReplyMessage("");
    setIsReplying(false);
  };

  if (isDeleting) {
    return null; // Ocultar mientras se elimina
  }

  return (
    <div className={`comment-item comment-item--depth-${Math.min(depth, 3)}`}>
      <div className="comment-item__avatar">
        <div className="comment-item__avatar-icon">
          {comment.usuario.username.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="comment-item__content">
        <div className="comment-item__header">
          <span className="comment-item__author">
            {comment.usuario.username}
          </span>
        </div>

        {isEditing ? (
          <div className="comment-item__edit-form">
            <textarea
              className="comment-item__textarea"
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
              rows={3}
              autoFocus
            />
            <div className="comment-item__edit-actions">
              <button
                className="comment-item__action-button comment-item__action-button--primary"
                onClick={handleEdit}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5 13L9 17L19 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Guardar
              </button>
              <button
                className="comment-item__action-button comment-item__action-button--secondary"
                onClick={handleCancelEdit}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="comment-item__message">{comment.mensaje}</p>

            <div className="comment-item__actions">
              {isOwner && (
                <>
                  <button
                    className="comment-item__action-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </button>
                  <button
                    className="comment-item__action-btn comment-item__action-btn--danger"
                    onClick={handleDelete}
                  >
                    Eliminar
                  </button>
                </>
              )}
              {currentUserId && depth < maxDepth && (
                <button
                  className="comment-item__action-btn"
                  onClick={() => setIsReplying(!isReplying)}
                >
                  Responder
                </button>
              )}
            </div>
          </>
        )}

        {/* Formulario de respuesta */}
        {isReplying && (
          <div className="comment-item__reply-form">
            <textarea
              className="comment-item__textarea"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder={`Responder a ${comment.usuario.username}...`}
              rows={3}
              autoFocus
            />
            <div className="comment-item__reply-actions">
              <button
                className="comment-item__action-button comment-item__action-button--primary"
                onClick={handleReply}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M22 2L11 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Responder
              </button>
              <button
                className="comment-item__action-button comment-item__action-button--secondary"
                onClick={handleCancelReply}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Respuestas anidadas */}
        {comment.respuestas && comment.respuestas.length > 0 && (
          <div className="comment-item__replies">
            {comment.respuestas.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                onEdit={onEdit}
                onDelete={onDelete}
                onReply={onReply}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
