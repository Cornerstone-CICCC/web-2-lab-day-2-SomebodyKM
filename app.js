$(function () {

  // your code here

  const nextBtn = $('header button').first()
  const prevBtn = $('header button').last()
  let currentUserId = 1
  const maxUser = 30


  prevBtn.on('click', function () {
    currentUserId = currentUserId > 1 ? currentUserId - 1 : maxUser
    getUserInfo(currentUserId)
  })

  nextBtn.on('click', function () {
    currentUserId = currentUserId < maxUser ? currentUserId + 1 : 1
    getUserInfo(currentUserId)
  })

  function getUserInfo(userId) {
    $.ajax({
      url: `https://dummyjson.com/users/${userId}`,
      type: "GET",
      success: function (res) {
        const fullname = `${res.firstName} ${res.lastName}`
        const age = res.age
        const email = res.email
        const phone = res.phone

        // image
        $('.info__image img').attr('src', res.image)

        // info
        const info = $('.info__content').empty()
        const fullnameInfo = $(`<h1>${fullname}</h1>`)
        const ageInfo = $(`<p><strong>Age:</strong> ${age}</p>`)
        const emailInfo = $(`<p><strong>Email:</strong> ${email}</p>`)
        const phoneInfo = $(`<p><strong>Phone:</strong> ${phone}</p>`)

        info
          .append(fullnameInfo)
          .append(ageInfo)
          .append(emailInfo)
          .append(phoneInfo)

        getUserPosts(userId, res.firstName)
        getUserTodos(userId, res.firstName)

      },
      error: function (err) {
        console.error(err)
      }
    })
  }

  $('.posts h3').on('click', function () {
    $('.posts ul').slideToggle()
  })

  $('.todos h3').on('click', function () {
    $('.todos ul').slideToggle()
  })

  const overlay = $('<div class="overlay" style="display:none"></div>')
  const modal = $('<div class="modal"></div>')
  const content = $('<div>')
  const closeModal = $('<button>').text('Close Modal')

  modal.append(content).append(closeModal)
  overlay.append(modal)
  $('.container').append(overlay)


  $('.posts ul').on('click', 'li h4', function () {
    const postId = $(this).closest('li').data('postid')

    if (!postId) return

    content.empty();
    overlay.show()

    $.ajax({
      url: `https://dummyjson.com/posts/${postId}`,
      type: "GET",
      success: function (res) {
        const modalTitle = $('<h1>').text(res.title)
        const modalContent = $('<p>').text(res.body)
        const views = $(`<p><i>Views: ${res.views}</i></p>`)

        content.append(modalTitle).append(modalContent).append(views)

      },
      error: function (err) {
        console.error(err)
      }
    })
  })
  overlay.on('click', 'button', function () {
    overlay.hide()
  })


  getUserInfo(currentUserId)
})

function getUserPosts(userId, firstname) {
  $.ajax({
    url: `https://dummyjson.com/users/${userId}/posts`,
    type: "GET",
    success: function (res) {
      const postH3 = $('.posts h3')
      const postUl = $('.posts ul').empty()

      postH3.text(`${firstname}'s Posts`)

      if (res.posts.length === 0) {
        postUl.append($('<li>').text('User has no posts'))
      } else {
        res.posts.forEach(post => {
          const postLi = $('<li>').attr('data-postid', post.id)
          const postH4 = $('<h4>').text(post.title)
          const postP = $('<p>').text(post.body)

          postLi.append(postH4).append(postP)
          postUl.append(postLi)
        })
      }
    },
    error: function (err) {
      console.error(err)
    }
  })
}

function getUserTodos(userId, firstname) {
  $.ajax({
    url: `https://dummyjson.com/users/${userId}/todos`,
    type: "GET",
    success: function (res) {
      const todoH3 = $('.todos h3')
      const todoUl = $('.todos ul').empty()

      todoH3.text(`${firstname}'s To Dos`)

      if (res.todos.length === 0) {
        todoUl.append($('<li>').text('User has no todos'))
      } else {
        res.todos.forEach(todo => {
          const todoLi = $('<li>').text(todo.todo)

          todoUl.append(todoLi)
        })
      }
    },
    error: function (err) {
      console.error(err)
    }
  })
}
