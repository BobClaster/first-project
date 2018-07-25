import React, {Component} from 'react';
import MarkdownRenderer from "react-markdown-renderer";


class Technology extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.obj.name,
            logo: props.obj.logo,
        };
    };

    render() {
        return (
            <span className="badge">
                {this.state.name}
            </span>
        );
    }
}


export default class UserProfile extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            link: "http://127.0.0.1:8000/user/api/" + this.props.match.params.id,
        };
    };

    componentWillMount() {
        fetch(this.state.link)
            .then(res => {
                return res.json();
            }).then(data => {
                this.setState({
                    user: data,
                });
                console.log(this.state.user);
        });
    };

    render() {
        const user = this.state.user;
        if (user.tech) {
            return (
                <div>
                    <div className="col-md-2">
                        <img src={user.avatar} alt="user avatar" className="user-avatar-article img-rounded " />
                    </div>
                    <div className="col-md-10">

                        <div className="username-article">
                            <h4>{user.name}</h4>
                            <h6 className="user-position-article">Посада: {user.position}</h6>
                            <h6 className="user-position-article">email: {user.email}</h6>
                            <h6 className="user-position-article">Дата народження: {user.date_birthday}</h6>
                            <h6 className="user-position-article">Рідне місто: {user.city}</h6>
                            <div>
                                Технології:
                                {user.tech.map((object, i) => <Technology obj={object} key={i} />)}
                            </div>
                            <div>
                                Соціальні мережі:
                                <a href={user.social.GitHub} target="_blank"> GitHub </a>
                                <a href={user.social.GitLab} target="_blank">GitLab </a>
                                <a href={user.social.LinkedIn} target="_blank">LinkedIn </a>
                                <a href={user.social.Facebook} target="_blank">Facebook </a>
                            </div>
                            <div className="about-me">
                                Про мене:
                                <MarkdownRenderer markdown={user.about_me} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div>Loading...</div>
        }

    };

}


