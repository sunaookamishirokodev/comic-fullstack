const genId = () => crypto.randomUUID().replace(/-/g, "");

export default genId;
