const formattedSelect = (data: []) => {
  return (data || []).map((item: any) => ({
    value: item.id,
    label: item.name,
  }));
};


export {
    formattedSelect
}