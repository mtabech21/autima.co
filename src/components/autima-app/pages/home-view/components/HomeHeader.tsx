import style from './header.module.scss'

function HomeHeader() {
    return (
        <div>
            <div className={style.managerHomeHeader}>
                <div className={style.managerHomeHeaderContainer}>
                    <h1 className={style.testClass}>Welcome to Autima!</h1>
                    <h2>Our app is currently under developement...</h2>
                </div>
            </div>
        </div>
    )
}

export default HomeHeader

