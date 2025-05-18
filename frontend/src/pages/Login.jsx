import LoginForm from "../components/LoginForm";

const Login = ({onLogin}) => {return <LoginForm onLogin={onLogin} redirectPage={"/dashboard"} />;};

export default Login;