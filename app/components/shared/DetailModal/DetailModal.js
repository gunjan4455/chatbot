import React from "react";

export default class DetailModal extends React.Component {
    constructor(props) {
        super(props);
    }

/*    handleSubmit(e) {
        e.preventDefault();
        const formData = {};
        for (const field in this.refs) {
            formData[field] = this.refs[field].value;
        }
        formData.imageUrl = this.props.book.imageUrl;
        formData.id = this.props.book.id;
        this.props.onEdit(formData);
    }*/

    render() {
        return (
            <div className="modal-backdrop detail-modal-background">
                <form>
                    <div className="col-sm-4 detail-modal">
                        <div>
                            <div className="modal-header">
                                <button type="button" className="close-detail-modal close" data-dismiss="modal" aria-label="Close">
                                </button>
                                <p className="modal-title">New request</p>
                            </div>
                            <div className="form-group col-sm-12">
                                {this.props.greetingMessage}
                            </div>
                        </div>
                        <div className="button-container">
                            <button type="submit" className="btn btn-default save_button"   onClick={this.props.handleSubmit}
                            >accept
                            </button>
                            <button type="button" className="btn btn-default decline_button"  onClick={this.props.onHideModal}>decline
                            </button>
                            <button type="button" className="btn btn-default btn-cross"  onClick={this.props.onHideModal}>X
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

