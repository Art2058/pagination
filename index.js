import './style.scss'
import Pagination from './modules/pagination' // pagination import

// 페이지네이션 생성
const pagination = new Pagination({
  onSelectLimit: function(limit) {
    getList(this.page, limit)
  },
  onPage: function(page) {
    getList(page, this.limit)
  }
})

const $list = document.querySelector('.list')
// 페이징 버튼들을 클릭할 때마다 실행되는 리스트 가져오기 함수
async function getList(page, count, isUpdateTotal = false) {
  $list.innerHTML = 'loading...'

  const requestUrl = `https://api.github.com/search/repositories?q=javascript&page=${page}&per_page=${count}`
  const data = await ajax(requestUrl)
  if (isUpdateTotal) {
    // 처음 리스트를 가져올 때는 페이지네이션을 그리기 위해 전체 카운트를 업데이트한다.
    // 한 번 그려진 이후에는 다시 업데이트할 필요는 없다.
    pagination.update({ totalCount: data.total_count })
  }

  $list.innerHTML = ''
  const avatarUrls = data.items.map(item => item.owner.avatar_url)
  // 리스트 생성
  avatarUrls.forEach(url => {
    const $img = document.createElement('img')
    $img.src = url
    $list.appendChild($img)
  })
}

getList(1, pagination.limit, true) // 첫 리스트 가져오기

// ajax polyfill
function ajax(url) {
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest()
    request.open('GET', url, true)

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        resolve(data)
      }
      else {
        reject('Bad request')
      }
    }
    request.onerror = function(err) {
      console.error('Request falied')
      reject(err)
    }

    request.send()
  })
}