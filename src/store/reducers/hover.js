const onHover = (state = {hover: false},action) => {
    switch(action.type) {
        case "hover":
            return {
                hover: true
            }

        default:
            return {
                hover: false
            };
        }
};

export default onHover;