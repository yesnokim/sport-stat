import MatchList from "../../components/MatchList/MatchList";
import SignOutButton from "../../components/SignOutButton/SignOutButton";
import ss from "./Main.module.scss"

const Main = () => {

    return <div className={ss.bg}>
        <div className={ss.header}><SignOutButton /></div><MatchList /></div>
}

export default Main;