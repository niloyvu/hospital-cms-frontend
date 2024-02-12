interface IEditorConfig {
    height: number;
    menubar: boolean;
    toolbar: string;
    plugins: string[];
}

export const EditorConfig: IEditorConfig = {
    height: 200,
    menubar: false,
    toolbar: "undo redo | formatselect | " +
        "bold italic forecolor backcolor | alignleft aligncenter " +
        "alignright alignjustify | bullist numlist outdent indent | " +
        "removeformat | help",
    plugins: [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table paste code help wordcount",
        "textcolor"
    ]
};

export const DetailsEditorConfig: IEditorConfig = {
    ...EditorConfig,
    height: 500,
};