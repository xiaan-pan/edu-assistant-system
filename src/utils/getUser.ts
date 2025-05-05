
export default function getUser(shouldLogin = true) {
    const user = JSON.parse(localStorage.getItem('user') || "{}");
    if (!Object.keys(user).length && shouldLogin) {
        location.href = '/login'
    }
    return user;
}