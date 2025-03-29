import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { SurveyInterface } from "../interfaces/survey.interface"
import "../styles/main.style.scss"
import { send_secure_request } from "../api/authorized-request"
import { useAuth } from "../hooks/AuthProvider"

async function fetchMySurveys(
  setAuth: (isAuth: boolean) => void,
  search: string,
  page: number,
  ordering: string,
  pageSize: number = 10
) {
  const response = await send_secure_request("get", "/surveys/self", setAuth,
    { search, page, pageSize, ordering }
  )
  return response
}

function MySurveysPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [orderingField, setOrderingField] = useState("updatedAt")
  const [orderingDirection, setOrderingDirection] = useState("ASC")

  const [debouncedSearch, setDebouncedSearch] = useState(search)

  const navigate = useNavigate()
  const { setAuth } = useAuth()

  const ordering = `${orderingField}:${orderingDirection}`

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mySurveys", debouncedSearch, page, ordering],
    queryFn: () => fetchMySurveys(setAuth, debouncedSearch, page, ordering),
  })
  
  // Debouncer
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="container">
      <h1>My Surveys</h1>

      {/* Search field */}
      <input
        type="text"
        placeholder="Search surveys..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Sort select */}
      <select value={orderingField} onChange={(e) => setOrderingField(e.target.value)}>
        <option value="createdAt">Created At</option>
        <option value="updatedAt">Updated At</option>
        <option value="name">Name</option>
      </select>

      {/* Sort direction */}
      <select value={orderingDirection} onChange={(e) => setOrderingDirection(e.target.value)}>
        <option value="ASC">Ascending</option>
        <option value="DESC">Descending</option>
      </select>

      {isLoading && <p>Loading surveys...</p>}
      {isError && <p className="error-message">Error loading surveys: {error.message}</p>}

      {/* Survey list */}
      {data?.surveys && data.surveys.length > 0 ? (
        <ul>
          {data!.surveys.map((survey: SurveyInterface) => (
            <li key={survey.id}>
              {survey.name}
              <button
                className="button"
                onClick={() => navigate(`/surveys/${survey.id}`)}
              >
                Open
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No surveys found.</p>
      )}

      {/* Pagination */}
      <div className="centered-container">
        <button
          className="button-secondary"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span> Page {page} </span>
        <button
          className="button-secondary"
          disabled={page >= (data?.totalPages || 1)}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default MySurveysPage