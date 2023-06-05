import propTypes from 'prop-types';

const Card = ({title, onClick, children}) => {
    return (
        <div
            onClick={onClick}
            className="card mb-3 cursor-pointer"
        >
            <div className="card-body py-2 d-flex align-items-center">
                    <div className='flex-grow-1'>{title}</div>
                    {children && <div>{children}</div>}
            </div>
        </div>
    );
};

Card.propTpyes = {
    title: propTypes.string.isRequireds,
    children: propTypes.element,
    onClick: propTypes.func,
};

Card.defaultProps = {
    children: null,
    onClick: () => {},
}

export default Card;