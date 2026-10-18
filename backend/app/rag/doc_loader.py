import io
import re
from typing import List, Dict, Any
from pypdf import PdfReader

class DocumentChunk(Dict[str, Any]):
    chunk_id: str
    doc_id: str
    doc_title: str
    category: str
    content: str
    page_number: int
    char_start: int
    char_end: int

def chunk_text(
    text: str,
    doc_id: str,
    doc_title: str,
    category: str = "General",
    chunk_size: int = 700,
    chunk_overlap: int = 120,
    page_number: int = 1
) -> List[Dict[str, Any]]:
    """
    Split text into cohesive chunks with semantic overlap, tracking character offsets.
    """
    chunks = []
    # Clean text
    clean = re.sub(r'\r\n', '\n', text)
    
    # Split by double newline (paragraphs) first or fixed length
    paragraphs = clean.split('\n\n')
    current_chunk = ""
    current_start = 0
    chunk_index = 0

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
            
        if len(current_chunk) + len(para) > chunk_size and len(current_chunk) > 200:
            chunk_id = f"{doc_id}-p{page_number}-c{chunk_index}"
            chunks.append({
                "chunk_id": chunk_id,
                "doc_id": doc_id,
                "doc_title": doc_title,
                "category": category,
                "content": current_chunk.strip(),
                "page_number": page_number,
                "char_start": current_start,
                "char_end": current_start + len(current_chunk)
            })
            chunk_index += 1
            # Keep overlap
            overlap_text = current_chunk[-chunk_overlap:] if len(current_chunk) > chunk_overlap else ""
            current_start += len(current_chunk) - len(overlap_text)
            current_chunk = overlap_text + "\n\n" + para
        else:
            if current_chunk:
                current_chunk += "\n\n" + para
            else:
                current_chunk = para

    if current_chunk.strip():
        chunk_id = f"{doc_id}-p{page_number}-c{chunk_index}"
        chunks.append({
            "chunk_id": chunk_id,
            "doc_id": doc_id,
            "doc_title": doc_title,
            "category": category,
            "content": current_chunk.strip(),
            "page_number": page_number,
            "char_start": current_start,
            "char_end": current_start + len(current_chunk)
        })

    return chunks

def extract_text_from_pdf(file_bytes: bytes, doc_id: str, doc_title: str, category: str = "Document") -> List[Dict[str, Any]]:
    """
    Extracts text from PDF bytes and produces page-attributed chunks.
    """
    reader = PdfReader(io.BytesIO(file_bytes))
    all_chunks = []
    
    for page_idx, page in enumerate(reader.pages):
        page_num = page_idx + 1
        page_text = page.extract_text() or ""
        if page_text.strip():
            page_chunks = chunk_text(
                text=page_text,
                doc_id=doc_id,
                doc_title=doc_title,
                category=category,
                page_number=page_num
            )
            all_chunks.extend(page_chunks)
            
    return all_chunks
