import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Cards } from "../components/feature-specific/Cards.component.jsx";
import { TransactionForm } from "../components/feature-specific/TransactionForm.component.jsx";

import { MdLogout } from "react-icons/md";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutation.js";
import toast from "react-hot-toast";
import { Loader } from "../components/common/Loader.component.jsx";
import { GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query.js";
import { GET_AUTHENTICATED_USER } from "../graphql/queries/user.query.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// const chartData = {
//   labels: ["Saving", "Expense", "Investment"],
//   datasets: [
//     {
//       label: "%",
//       data: [13, 8, 3],
//       backgroundColor: [
//         "rgba(75, 192, 192)",
//         "rgba(255, 99, 132)",
//         "rgba(54, 162, 235)",
//       ],
//       borderColor: [
//         "rgba(75, 192, 192)",
//         "rgba(255, 99, 132)",
//         "rgba(54, 162, 235, 1)",
//       ],
//       borderWidth: 1,
//       borderRadius: 30,
//       spacing: 10,
//       cutout: 130,
//     },
//   ],
// };

export const HomeScreen = () => {
  const [logout, { loading, errorThatCanBeUsedButWillNotBe, client }] =
    useMutation(LOGOUT, {
      refetchQueries: ["GetAuthenticatedUser"], // this matches the "query GetAuthenticatedUser" in user.query.js
    });

  const { data } = useQuery(GET_TRANSACTION_STATISTICS);
  // console.log("categoryStats:", data);

  const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);
  console.log("authUserData:", authUserData);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "$",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130,
      },
    ],
  });

  useEffect(() => {
    if (data?.categoryStatistics) {
      const categories = data.categoryStatistics.map((stat) => stat.category);
      const fullAmount = data.categoryStatistics.map(
        (stat) => stat.totalAmount
      );

      const backgroundColors = [];
      const borderColors = [];

      categories.forEach((category) => {
        if (category === "saving") {
          backgroundColors.push("rgba(75, 192, 192)");
          borderColors.push("rgba(75, 192, 192)");
        } else if (category === "expense") {
          backgroundColors.push("rgba(255, 99, 132)");
          borderColors.push("rgba(255, 99, 132)");
        } else if (category === "investment") {
          backgroundColors.push("rgba(54, 162, 235)");
          borderColors.push("rgba(54, 162, 235, 1)");
        }
      });

      console.log("backgroundColors:", backgroundColors);
      console.log("borderColors:", borderColors);

      setChartData((prev) => ({
        labels: categories,
        datasets: [
          {
            ...prev.datasets[0],
            data: fullAmount,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
          },
        ],
      }));
    }
  }, [data]);

  const handleLogout = async () => {
    try {
      await logout();
      // clear the apollo client cache from docs
      // https://www.apollographql.com/docs/react/caching/advanced-topics
      client.resetStore();
    } catch (err) {
      console.log("Error logging out:", err);
      toast.error(err.message);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
        <div className="flex items-center">
          <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
            Spend wisely, track wisely
          </p>
          <img
            src={authUserData?.authUser.profilePicture}
            className="w-11 h-11 rounded-full border cursor-pointer"
            alt="Avatar"
          />
          {!loading && (
            <MdLogout
              className="mx-2 w-5 h-5 cursor-pointer"
              onClick={handleLogout}
            />
          )}
          {/* loading spinner */}
          {loading && <Loader />}
        </div>
        <div className="flex flex-wrap w-full justify-center items-center gap-6">
          {data?.categoryStatistics.length > 0 && (
            <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
              <Doughnut data={chartData} />
            </div>
          )}

          <TransactionForm />
        </div>
        <Cards />
      </div>
    </>
  );
};
