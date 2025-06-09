

export const Input = ({ ref, placeholder }: {
    ref?: any,
    placeholder: string
}) => {
    return <div>
        <input
            className="py-2 border rounded-lg m-2 px-8" id="title"
            type="text"
            placeholder={placeholder}
            ref={ref}>
        </input>
    </div>
}