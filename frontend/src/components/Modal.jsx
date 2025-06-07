import ReactDOM from "react-dom";
import "../styles/Modal.css";

const Modal = ({message, buttons = []}) =>
{
    if (!message) return null;

    return ReactDOM.createPortal(
        <div className="overlay" onClick={(e) => e.stopPropagation()}>
            <div className="modal">
                <div className="content">
                    <p>{message}</p>
                    <div className="button-group">
                        {buttons.map(({label, action}, index) => (
                            <button key={index} onClick={action}>{label}</button>))}
                    </div>
                </div>
            </div>
        </div>, document.body
    );
};

export default Modal;