import './style.scss'

class Pagination {
  $prevBtn = document.createElement('button')
  $firstPageBtn = document.createElement('button')
  $jumpPrevBtn = document.createElement('button')
  $pageZone = document.createElement('p')
  $jumpNextBtn = document.createElement('button')
  $lastPageBtn = document.createElement('button')
  $nextBtn = document.createElement('button')

  constructor({
    selector = '#pagination',
    pageLimitShow = true,
    limits = [10, 25, 50],
    page = 1,
    totalCount = 0,
    pagesToShow = 9,
    onSelectLimit = () => {},
    onPage = () => {}
  }) {
    this.selector = selector
    this.pageLimitShow = pageLimitShow
    this.limits = limits
    this.limit = limits[0]
    this.page = page
    this.totalCount = totalCount
    this.pagesToShow = pagesToShow
    this.onSelectLimit = onSelectLimit
    this.onPage = onPage

    this.init()
  }

  init() {  
    if (this.totalCount <= 0) return

    const $pagination = document.querySelector(this.selector)
    $pagination.classList.add('pagination-container')

    if (this.pageLimitShow) {
      /** 왼쪽 리스트 수 제한 버튼들 생성 */
      const $pageLimit = document.createElement('div')
      $pageLimit.classList.add('page-limit')
      this.createLimits($pageLimit)
      $pagination.appendChild($pageLimit)
    }

    /** 오른쪽 페이징 버튼들 생성 */
    const $paginate = document.createElement('div')
    $paginate.classList.add('paginate')
    this.createPaginate($paginate)
    $pagination.appendChild($paginate)
  }

  update({
    selector = this.selector,
    pageLimitShow = this.pageLimitShow,
    limits = this.limits,
    page = this.page,
    totalCount = this.totalCount,
    pagesToShow = this.pagesToShow,
    onSelectLimit = this.onSelectLimit,
    onPage = this.onPage
  }) {
    this.selector = selector,
    this.pageLimitShow = pageLimitShow,
    this.limits = limits,
    this.limit = limits[0]
    this.page = page,
    this.totalCount = totalCount,
    this.pagesToShow = pagesToShow,
    this.onSelectLimit = onSelectLimit,
    this.onPage = onPage

    this.init()
  }

  createLimits($el) {
    this.limits.forEach(limitNum => {
      const $btn = document.createElement('button')
      $btn.textContent = limitNum
      
      if (limitNum === this.limit) {
        $btn.classList.add('selected')
        $btn.setAttribute('disabled', true)
      }
      $btn.addEventListener('click', ({ target }) => {
        target.parentNode.childNodes.forEach(node => {
          node.classList.remove('selected')
          node.removeAttribute('disabled')
        })
        
        target.classList.add('selected')
        target.setAttribute('disabled', true)

        this.selectLimit(limitNum)

        this.clickPaginateAction()
      })

      $el.appendChild($btn)
    })
  }

  createPaginate($el) {
    this.setElementContent(this.$prevBtn, 'prev', '<')
    this.$prevBtn.addEventListener('click', () => {
      this.onPrev()
      this.clickPaginateAction()
    })

    this.setElementContent(this.$firstPageBtn, 'first-page', '1')
    this.$firstPageBtn.addEventListener('click', () => {
      this.goPage(1)
      this.clickPaginateAction()
    })

    this.setElementContent(this.$jumpPrevBtn, 'jump-prev', '...')
    this.$jumpPrevBtn.addEventListener('click', () => {
      this.onJumpPrev()
      this.clickPaginateAction()
    })

    this.setElementContent(this.$jumpNextBtn, 'jump-next', '...')
    this.$jumpNextBtn.addEventListener('click', () => {
      this.onJumpNext()
      this.clickPaginateAction()
    })

    this.setElementContent(this.$lastPageBtn, 'last-page', this.totalPage.toString())
    this.$lastPageBtn.addEventListener('click', () => {
      this.goPage(this.totalPage)
      this.clickPaginateAction()
    })

    this.setElementContent(this.$nextBtn, 'next', '>')
    this.$nextBtn.addEventListener('click', () => {
      this.onNext()
      this.clickPaginateAction()
    })

    this.clickPaginateAction()

    $el.appendChild(this.$prevBtn)
    $el.appendChild(this.$firstPageBtn)
    $el.appendChild(this.$jumpPrevBtn)
    $el.appendChild(this.$pageZone)
    $el.appendChild(this.$jumpNextBtn)
    $el.appendChild(this.$lastPageBtn)
    $el.appendChild(this.$nextBtn)
  }

  createPages() {
    this.$pageZone.innerHTML = ''

    this.getPages().forEach(pageNum => {
      const $btn = document.createElement('button')
      $btn.textContent = pageNum
      
      if (pageNum === this.page) {
        $btn.classList.add('active')
        $btn.setAttribute('disabled', true)
      }
      
      $btn.addEventListener('click', () => {
        this.goPage(pageNum)
        this.clickPaginateAction()
      })

      this.$pageZone.appendChild($btn)
    })
  }

  clickPaginateAction() {
    this.disabledPrevBtn(this.$prevBtn)
    this.disabledNextBtn(this.$nextBtn)
    this.disabledJumpPrevBtn(this.$firstPageBtn)
    this.disabledJumpNextBtn(this.$lastPageBtn)
    this.disabledJumpPrevBtn(this.$jumpPrevBtn)
    this.disabledJumpNextBtn(this.$jumpNextBtn)
    this.createPages()
  }

  setElementContent($el, className, text) {
    $el.classList.add(className)
    $el.textContent = text
  }
  disabledPrevBtn($el) {
    if (this.page <= 1) this.disableBtn($el)
    else this.enableBtn($el)
  }
  disabledJumpPrevBtn($el) {
    if (this.page <= this.pagesToShow) this.disableBtn($el)
    else this.enableBtn($el)
  }
  disabledJumpNextBtn($el) {
    if (this.pagesToShow > this.totalPage - this.rangeStart) this.disableBtn($el)
    else this.enableBtn($el)
  }
  disabledNextBtn($el) {
    if (this.page >= this.totalPage) this.disableBtn($el)
    else this.enableBtn($el)
  }
  disableBtn($el) {
    $el.setAttribute('disabled', true)
    $el.classList.add('disabled')
  }
  enableBtn($el) {
    $el.removeAttribute('disabled')
    $el.classList.remove('disabled')
  }

	selectLimit(n) {
		this.limit = n
		this.page = 1
		this.onSelectLimit(n)
	}

	goPage(n) {
		this.page = n
		this.onPage(n)
	}

	onPrev() {
		if (this.page < 1) return
		this.goPage(--this.page)
	}
	onNext() {
		if (this.page >= this.totalPage) return
		this.goPage(++this.page)
	}
	onJumpPrev() {
		const jumpPrevPage = this.rangeStart - 1
		if (jumpPrevPage < 1) return
		this.goPage(jumpPrevPage)
	}
	onJumpNext() {
		const jumpNextPage = this.rangeStart + this.pagesToShow
		if (jumpNextPage < 1) return
		this.goPage(jumpNextPage)
	}

	get totalPage() {
		return Math.ceil(this.totalCount / this.limit) || 1
	}
	get rangeStart() {
		return this.pagesToShow * Math.ceil(this.page / this.pagesToShow) - this.pagesToShow + 1
	}

	getPages() {
		const pages = Array.from({ length: this.pagesToShow }, (_, i) => {
			return this.rangeStart + i
		}).filter(v => v <= this.totalPage)

		return pages
	}

	getMinCurrPageItem() {
		return this.limit * this.page - this.limit + 1
	}
	getMaxCurrPageItem() {
		let max = this.limit * this.page
		if (max > this.totalCount) {
			max = this.totalCount
		}
		return max
	}
}

export default Pagination