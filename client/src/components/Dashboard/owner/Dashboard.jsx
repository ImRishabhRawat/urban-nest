import Loader from '../../../components/Loader/Loading';
import Error from '../../../components/Error/Error';
import useGetProfile from '../../../hooks/useFetchData';
import { BASE_URL } from '../../../config';
import starIcon from '../../../assets/images/Star.png';

import Tab from './Tab';
import { useState, useEffect } from 'react';
import OwnerAbout from '../../../pages/owner/OwnerAbout';
import Profile from './Profile';
import Property from '../../../pages/Property';

const Dashboard = () => {

  const { data, loading, error } = useGetProfile(`${BASE_URL}/owners/profile/me`);

  const [tab, setTab] = useState('overview');

  useEffect(() => {
    console.log('Data:', data);
    console.log('Loading:', loading);
    console.log('Error:', error);
  }, [data, loading, error]);

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {loading && !error && <Loader />}
        {error && !loading && <Error errMessage={error} />}
        {!loading && !error && data && (
          <div className="grid lg:grid-cols-3 gap-[30px] lg:gap-[50px]">
            <Tab data={data} tab={tab} setTab={setTab} />
            <div className="lg:col-span-2">
              {data.isApproved === "pending" && (
                <div className='flex p-4 text-yellow-800 bg-yellow-50 rounded-lg'>
                  <span className="flex items-center justify-center">*</span><span className="sr-only">Info</span>
                  <div className="ml-3 text-sm font-medium">
                    To get approval please complete your profile. We'll 
                    review manually and approve within 3 days.
                  </div>
                </div>
              )}

              <div className="mt-8">
                {tab === "overview" && (
                  <div className="">
                    <div className="flex items-center gap-4 mb-10">
                      <figure className='max-w-[200px] max-h-[200px] overflow-hidden object-cover'>
                        <img src={data?.photo} alt="" />
                      </figure>
                      <div>
                        <h3 className="text-[22px] leading-9 font-bold text-headingColor mt-3">
                          {data.name}
                        </h3>
                        <p className="text_para font-[15px] lg:max-w-[390px] leading-6">
                          {data.location}
                        </p>
                      </div>
                    </div>
                    <OwnerAbout owner={data} />   
                  </div>
                )}
                {tab === "properties" && <Property properties={data.properties} />}
                {tab === "settings" && <Profile ownerData={data} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
