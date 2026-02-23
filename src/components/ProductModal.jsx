import React, { useEffect, useState } from "react";

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [count, setCount] = useState(""); 

    useEffect(() => {
        if (!open) return;
        setName(initialProduct?.name ?? "");
        setCategory(initialProduct?.category ?? "");
        setDescription(initialProduct?.description ?? "");
        setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
        setCount(initialProduct?.count != null ? String(initialProduct.count) : "");
    }, [open, initialProduct]);

    if (!open) return null;

    const title = mode === "edit" ? "Редактирование товара" : "Создание товара";

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmed = name.trim();
        const trimmedCategory = category.trim();
        const trimmedDescription = description.trim();
        const parsedPrice = Number(price);
        const parsedCount = Number(count);

        if (!trimmed) {
            alert("Введите название");
            return;
        }
        if (!trimmedCategory) {
            alert("Введите категорию");
            return;
        }
        if (!trimmedDescription) {
            alert("Введите описание");
            return;
        }
        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            alert("Введите корректную стоимость (положительное число)");
            return;
        }
        if (!Number.isFinite(parsedCount) || parsedCount < 0) {
            alert("Введите корректное количество (положительное число)");
            return;
        }

        onSubmit({
            id: initialProduct?.id,
            name: trimmed,
            category: trimmedCategory,
            description: trimmedDescription,
            price: parsedPrice,
            count: parsedCount,
        });
    };

    return (
        <div className="backdrop" onMouseDown={onClose}>
            <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="modal__header">
                    <div className="modal__title">{title}</div>
                    <button className="iconBtn" onClick={onClose} aria-label="Закрыть">
                        ✕
                    </button>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <label className="label">
                        Название
                        <input
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Например, Кокакола"
                            autoFocus
                        />
                    </label>

                    <label className="label">
                        Категория
                        <input
                            className="input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Например, Напитки"
                            autoFocus
                        />
                    </label>

                    <label className="label">
                        Описание
                        <textarea
                            className="textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Описание товара..."
                            rows="3"
                        />
                    </label>

                    <label className="label">
                        Стоимость
                        <input
                            className="input"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Например, 200"
                            inputMode="numeric"
                        />
                    </label>

                    <label className="label">
                        Количество на складе
                        <input
                            className="input"
                            value={count}
                            onChange={(e) => setCount(e.target.value)}
                            placeholder="Например, 50"
                            inputMode="numeric"
                        />
                    </label>

                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {mode === "edit" ? "Сохранить" : "Создать"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}