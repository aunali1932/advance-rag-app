#from langchain.document_loaders import PyMuPDFLoader,DirectoryLoader

# def load_pdf(directory):
#     loader = DirectoryLoader(directory, glob="*.pdf", loader_cls=PyMuPDFLoader)
#     documents = loader.load()
#     return documents

import fitz  


def load_pdf(uploaded_file):
    if uploaded_file.content_type == "application/pdf":
        # Read the file content synchronously
        file_bytes = uploaded_file.file.read()
        document = fitz.open(stream=file_bytes, filetype="pdf")
        pages = []
        for page in document:
            pages.append({
                "page_content": page.get_text("text")
            })
        return pages
    else:
        raise ValueError("Uploaded file is not a PDF")
