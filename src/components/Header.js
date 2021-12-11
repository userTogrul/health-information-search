import Proptypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import Button from './Button'
import { Link } from 'react-router-dom'


const Header = ({ title, onSearch, showSearch }) => {
    const location = useLocation()

    return (
        <header className="header">
            <div className="logo"><Link to="/" >{title}</Link></div>
            {location.pathname !== '/' && (
            <Button
                color={showSearch && 'steelblue'}
                text={showSearch ? 'Close' : 'Search'}
                onClick={onSearch}
            />
            )}
        </header>
    )
}

Header.defaultProps = {
    title: 'HEALTH INFORMATION SEARCH',
}

Header.propTypes = {
    title: Proptypes.string.isRequired
}

export default Header