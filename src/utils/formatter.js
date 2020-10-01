export const amountFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2
})
export const dateFormatter = (date) => new Date(date).getDate()+"-"+(new Date(date).getMonth()+ 1)+'-'+new Date(date).getFullYear()