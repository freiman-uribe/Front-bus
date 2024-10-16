import { useEffect, useState } from 'react';
import { Axios } from '@/resources/axios/axios';
import { formattedSelect } from '@/resources/helpers';

export function useLists() {
  const [typeList, setTypeList] = useState<any>([]);
  const [companyList, setCompanyList] = useState<any>([]);

  useEffect(() => {
    const listType = async () => {
      try {
        const { data } = await Axios.get("/common/list-types?codes=type_card");
        setTypeList(formattedSelect(data[0].listItem));
      } catch (error) {
        console.error("Error fetching type list:", error);
      }
    };

    const listCompany = async () => {
      try {
        const { data } = await Axios.get("/common/list-types?codes=type_company");
        setCompanyList(formattedSelect(data[0].listItem));
      } catch (error) {
        console.error("Error fetching company list:", error);
      }
    };

    listType();
    listCompany();
  }, []);

  return { typeList, companyList };
}
