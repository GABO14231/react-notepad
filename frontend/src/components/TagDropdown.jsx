import {useState, useCallback, memo} from "react";

export const TagDropdown = memo(({availableTags, selectedTags, onChange}) =>
{
    const [open, setOpen] = useState(false);
    const toggleDropdown = useCallback(() => {setOpen((prev) => !prev);}, []);
    const handleToggleOption = useCallback((tag) =>
    {
        if (selectedTags.includes(tag)) onChange(selectedTags.filter((t) => t !== tag));
        else onChange([...selectedTags, tag]);
    }, [onChange, selectedTags]);

    return (
        <div className="tag-dropdown" tabIndex={0} role="button" onClick={toggleDropdown}
            onKeyDown={(e) => {if (e.key === "Enter") toggleDropdown();}} aria-expanded={open}>
            <div className="dropdown-header">
                {selectedTags.length === 0 ? "Select tags" : selectedTags.join(", ")}
                <span className="dropdown-arrow">▼</span>
            </div>
            {open && (
                <div className="dropdown-options" onClick={(e) => e.stopPropagation()}>
                    {availableTags.map((tag) => (
                        <label key={tag} className="dropdown-option">
                            <input type="checkbox" checked={selectedTags.includes(tag)}
                                onChange={() => handleToggleOption(tag)}/> {tag}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
});